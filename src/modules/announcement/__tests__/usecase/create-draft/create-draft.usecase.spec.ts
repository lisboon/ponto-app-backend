import CreateDraftUseCase from '../../../usecase/create-draft/create-draft.usecase';
import { AnnouncementStatus } from '@/modules/@shared/domain/enums';

const gateway = {
  create: jest.fn().mockResolvedValue(undefined),
  findById: jest.fn(),
  update: jest.fn(),
  list: jest.fn(),
  findAllActiveUserEmails: jest.fn(),
  markRead: jest.fn(),
};

describe('CreateDraftUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('cria rascunho e persiste', async () => {
    const uc = new CreateDraftUseCase(gateway);
    const out = await uc.execute({
      authorId: '00000000-0000-4000-8000-000000000001',
      title: 'Reunião geral',
      content: 'Haverá uma reunião na sexta.',
    });
    expect(gateway.create).toHaveBeenCalledTimes(1);
    expect(out.status).toBe(AnnouncementStatus.DRAFT);
    expect(out.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
