import PublishUseCase from '../../../usecase/publish/publish.usecase';
import { Announcement } from '../../../domain/announcement.entity';
import { AnnouncementStatus } from '@/modules/@shared/domain/enums';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';

const draft = () =>
  Announcement.create({
    authorId: '00000000-0000-4000-8000-000000000001',
    title: 'Reunião geral',
    content: 'Haverá uma reunião na sexta.',
  });

const makeGateway = (existing: Announcement | null) => ({
  create: jest.fn(),
  findById: jest.fn().mockResolvedValue(existing),
  update: jest.fn().mockResolvedValue(undefined),
  list: jest.fn(),
  findAllActiveUserEmails: jest.fn(),
  markRead: jest.fn(),
});

const makeDispatcher = () => ({
  dispatch: jest.fn().mockResolvedValue(undefined),
  register: jest.fn(),
  has: jest.fn(),
  clear: jest.fn(),
});

describe('PublishUseCase', () => {
  it('publica + persiste + despacha evento', async () => {
    const a = draft();
    const gateway = makeGateway(a);
    const dispatcher = makeDispatcher();
    const uc = new PublishUseCase(gateway, dispatcher);

    const out = await uc.execute({ id: a.id });

    expect(out.status).toBe(AnnouncementStatus.PUBLISHED);
    expect(gateway.update).toHaveBeenCalledTimes(1);
    expect(dispatcher.dispatch).toHaveBeenCalledTimes(1);
  });

  it('lança NotFoundError quando id não existe', async () => {
    const gateway = makeGateway(null);
    const dispatcher = makeDispatcher();
    const uc = new PublishUseCase(gateway, dispatcher);
    await expect(
      uc.execute({ id: '00000000-0000-4000-8000-000000000000' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
