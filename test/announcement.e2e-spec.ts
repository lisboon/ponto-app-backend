import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, makeToken } from './helpers/bootstrap.helper';
import AnnouncementFacade from '@/modules/announcement/facade/announcement.facade';
import { AnnouncementStatus, UserRole } from '@/modules/@shared/domain/enums';

const mockFacade = {
  createDraft: jest.fn(),
  publish: jest.fn(),
  findById: jest.fn(),
  list: jest.fn(),
  markRead: jest.fn(),
};

const draft = () => ({
  id: '00000000-0000-4000-8000-000000000020',
  authorId: '00000000-0000-4000-8000-000000000001',
  title: 'Reunião geral',
  content: 'Haverá reunião na sexta.',
  status: AnnouncementStatus.DRAFT,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('Announcements — golden paths (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let employeeToken: string;

  beforeAll(async () => {
    app = await createTestApp((b) =>
      b.overrideProvider(AnnouncementFacade).useValue(mockFacade),
    );
    adminToken = makeToken(app, UserRole.ADMIN);
    employeeToken = makeToken(app, UserRole.EMPLOYEE);
  });

  afterAll(() => app.close());
  beforeEach(() => jest.clearAllMocks());

  it('POST /announcements — 401 sem token', () => {
    return request(app.getHttpServer()).post('/announcements').expect(401);
  });

  it('POST /announcements — 403 para EMPLOYEE', () => {
    return request(app.getHttpServer())
      .post('/announcements')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ title: 'Test', content: 'ok' })
      .expect(403);
  });

  it('POST /announcements — 422 título curto demais', () => {
    return request(app.getHttpServer())
      .post('/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'AB', content: 'ok' })
      .expect(422);
  });

  it('POST /announcements — 201 golden path', async () => {
    mockFacade.createDraft.mockResolvedValue(draft());

    const res = await request(app.getHttpServer())
      .post('/announcements')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Reunião geral', content: 'Haverá reunião na sexta.' })
      .expect(201);

    expect(res.body).toHaveProperty('status', AnnouncementStatus.DRAFT);
    expect(mockFacade.createDraft).toHaveBeenCalledTimes(1);
  });

  it('POST /announcements/:id/publish — 200 golden path', async () => {
    mockFacade.publish.mockResolvedValue({
      ...draft(),
      status: AnnouncementStatus.PUBLISHED,
      publishedAt: new Date(),
    });

    const res = await request(app.getHttpServer())
      .post('/announcements/00000000-0000-4000-8000-000000000020/publish')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('status', AnnouncementStatus.PUBLISHED);
  });

  it('GET /announcements — 200 para EMPLOYEE', async () => {
    mockFacade.list.mockResolvedValue({ items: [draft()] });

    const res = await request(app.getHttpServer())
      .get('/announcements')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);

    expect(res.body.items).toHaveLength(1);
  });

  it('POST /announcements/:id/read — 200 marca como lido', async () => {
    mockFacade.markRead.mockResolvedValue({ ok: true });

    await request(app.getHttpServer())
      .post('/announcements/00000000-0000-4000-8000-000000000020/read')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);

    expect(mockFacade.markRead).toHaveBeenCalledWith({
      announcementId: '00000000-0000-4000-8000-000000000020',
      userId: '00000000-0000-4000-8000-000000000001',
    });
  });
});
