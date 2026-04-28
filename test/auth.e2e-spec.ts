import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from './helpers/bootstrap.helper';
import UserFacade from '@/modules/user/facade/user.facade';
import { UserRole } from '@/modules/@shared/domain/enums';

const mockUserFacade = {
  register: jest.fn(),
  login: jest.fn(),
  findById: jest.fn(),
  updateProfile: jest.fn(),
  changeRole: jest.fn(),
  deactivate: jest.fn(),
  reactivate: jest.fn(),
  delete: jest.fn(),
  assignWorkSchedule: jest.fn(),
  list: jest.fn(),
};

describe('Auth — golden paths (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp((b) =>
      b.overrideProvider(UserFacade).useValue(mockUserFacade),
    );
  });

  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  it('POST /auth/login — 422 com body vazio', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({})
      .expect(422);
  });

  it('POST /auth/login — 422 com email inválido', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nao-email', password: '123456' })
      .expect(422);
  });

  it('POST /auth/login — 200 no golden path', async () => {
    mockUserFacade.login.mockResolvedValue({
      token: 'jwt.token.here',
      user: {
        id: '00000000-0000-4000-8000-000000000001',
        email: 'admin@studio.com',
        role: UserRole.ADMIN,
      },
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@studio.com', password: 'senha123' })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(mockUserFacade.login).toHaveBeenCalledTimes(1);
  });

  it('GET /users — 401 sem token', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });
});
