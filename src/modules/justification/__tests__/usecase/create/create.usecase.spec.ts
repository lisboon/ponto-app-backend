import CreateJustificationUseCase from '../../../usecase/create/create.usecase';
import { JustificationStatus } from '@/modules/@shared/domain/enums';

describe('CreateJustificationUseCase', () => {
  it('cria e persiste a justificação', async () => {
    const gateway = {
      findById: jest.fn(),
      create: jest.fn().mockResolvedValue(undefined),
      update: jest.fn(),
      search: jest.fn(),
    };
    const useCase = new CreateJustificationUseCase(gateway);

    const out = await useCase.execute({
      userId: '00000000-0000-4000-8000-000000000001',
      workDayId: '00000000-0000-4000-8000-000000000002',
      createdBy: '00000000-0000-4000-8000-000000000003',
      description: 'Esqueceu de bater o ponto na entrada',
    });

    expect(gateway.create).toHaveBeenCalledTimes(1);
    expect(out.status).toBe(JustificationStatus.PENDING);
    expect(out.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
