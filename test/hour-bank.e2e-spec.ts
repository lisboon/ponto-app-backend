import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, makeToken } from './helpers/bootstrap.helper';
import HourBankFacade from '@/modules/hour-bank/facade/hour-bank.facade';
import { UserRole } from '@/modules/@shared/domain/enums';

const mockFacade = {
  findByUser: jest.fn(),
  recalculate: jest.fn(),
};

const hourBank = (balanceMinutes = 120) => ({
  id: '00000000-0000-4000-8000-000000000030',
  userId: '00000000-0000-4000-8000-000000000001',
  balanceMinutes,
  updatedAt: new Date(),
});

describe('HourBank — golden paths (e2e)', () => {
  let app: INestApplication;
  let managerToken: string;
  let adminToken: string;
  let employeeToken: string;
  const userId = '00000000-0000-4000-8000-000000000001';

  beforeAll(async () => {
    app = await createTestApp((b) =>
      b.overrideProvider(HourBankFacade).useValue(mockFacade),
    );
    managerToken = makeToken(app, UserRole.MANAGER);
    adminToken = makeToken(app, UserRole.ADMIN);
    employeeToken = makeToken(app, UserRole.EMPLOYEE);
  });

  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  it('GET /hour-bank/:userId — 401 sem token', () => {
    return request(app.getHttpServer()).get(`/hour-bank/${userId}`).expect(401);
  });

  it('GET /hour-bank/:userId — 403 para EMPLOYEE', () => {
    return request(app.getHttpServer())
      .get(`/hour-bank/${userId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(403);
  });

  it('GET /hour-bank/:userId — 200 para MANAGER', async () => {
    mockFacade.findByUser.mockResolvedValue(hourBank());

    const res = await request(app.getHttpServer())
      .get(`/hour-bank/${userId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('balanceMinutes', 120);
  });

  it('POST /hour-bank/:userId/recalculate — 403 para MANAGER', () => {
    return request(app.getHttpServer())
      .post(`/hour-bank/${userId}/recalculate`)
      .set('Authorization', `Bearer ${managerToken}`)
      .expect(403);
  });

  it('POST /hour-bank/:userId/recalculate — 200 para ADMIN', async () => {
    mockFacade.recalculate.mockResolvedValue(hourBank(480));

    const res = await request(app.getHttpServer())
      .post(`/hour-bank/${userId}/recalculate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('balanceMinutes', 480);
    expect(mockFacade.recalculate).toHaveBeenCalledWith({ userId });
  });
});
