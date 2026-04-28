import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, makeToken } from './helpers/bootstrap.helper';
import TimeClockFacade from '@/modules/time-clock/facade/time-clock.facade';
import { UserRole, DayStatus } from '@/modules/@shared/domain/enums';

const mockFacade = {
  punch: jest.fn(),
  manualPunch: jest.fn(),
  findDayByDate: jest.fn(),
  listHistory: jest.fn(),
  recalculateDay: jest.fn(),
  closeDay: jest.fn(),
};

const workDay = () => ({
  id: '00000000-0000-4000-8000-000000000010',
  userId: '00000000-0000-4000-8000-000000000001',
  date: new Date().toISOString().slice(0, 10),
  status: DayStatus.OPEN,
  workedMinutes: 0,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('TimeClock — golden paths (e2e)', () => {
  let app: INestApplication;
  let employeeToken: string;
  let adminToken: string;

  beforeAll(async () => {
    app = await createTestApp((b) =>
      b.overrideProvider(TimeClockFacade).useValue(mockFacade),
    );
    employeeToken = makeToken(app, UserRole.EMPLOYEE);
    adminToken = makeToken(app, UserRole.ADMIN);
  });

  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  it('POST /time-clock/punch — 401 sem token', () => {
    return request(app.getHttpServer()).post('/time-clock/punch').expect(401);
  });

  it('POST /time-clock/punch — 201 no golden path', async () => {
    mockFacade.punch.mockResolvedValue(workDay());

    await request(app.getHttpServer())
      .post('/time-clock/punch')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(201);

    expect(mockFacade.punch).toHaveBeenCalledTimes(1);
  });

  it('GET /time-clock/me/today — retorna WorkDay do dia', async () => {
    mockFacade.findDayByDate.mockResolvedValue(workDay());

    const res = await request(app.getHttpServer())
      .get('/time-clock/me/today')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('status', DayStatus.OPEN);
  });

  it('POST /time-clock/users/:id/close — 403 para EMPLOYEE', () => {
    return request(app.getHttpServer())
      .post('/time-clock/users/00000000-0000-4000-8000-000000000001/close')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(403);
  });

  it('POST /time-clock/users/:id/close — 201 para ADMIN', async () => {
    mockFacade.closeDay.mockResolvedValue({
      ...workDay(),
      status: DayStatus.CLOSED,
    });

    await request(app.getHttpServer())
      .post('/time-clock/users/00000000-0000-4000-8000-000000000001/close')
      .send({ date: new Date().toISOString().slice(0, 10) })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);
  });
});
