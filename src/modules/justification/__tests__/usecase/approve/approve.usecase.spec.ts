import ApproveJustificationUseCase from '../../../usecase/approve/approve.usecase';
import { Justification } from '../../../domain/justification.entity';
import { JustificationStatus } from '@/modules/@shared/domain/enums';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';

const valid = () =>
  Justification.create({
    userId: '00000000-0000-4000-8000-000000000001',
    workDayId: '00000000-0000-4000-8000-000000000002',
    createdBy: '00000000-0000-4000-8000-000000000003',
    description: 'Justificativa válida',
  });

describe('ApproveJustificationUseCase', () => {
  it('aprova + dispara evento + persiste', async () => {
    const j = valid();
    const gateway = {
      findById: jest.fn().mockResolvedValue(j),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      search: jest.fn(),
    };
    const dispatcher = {
      dispatch: jest.fn().mockResolvedValue(undefined),
      register: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
    };
    const useCase = new ApproveJustificationUseCase(gateway, dispatcher);

    const out = await useCase.execute({
      id: j.id,
      reviewerId: '00000000-0000-4000-8000-000000000099',
      reviewNote: 'Ok',
    });

    expect(out.status).toBe(JustificationStatus.APPROVED);
    expect(gateway.update).toHaveBeenCalledWith(j);
    expect(dispatcher.dispatch).toHaveBeenCalledTimes(1);
  });

  it('NotFoundError quando id não existe', async () => {
    const gateway = {
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      search: jest.fn(),
    };
    const dispatcher = {
      dispatch: jest.fn(),
      register: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
    };
    const useCase = new ApproveJustificationUseCase(gateway, dispatcher);

    await expect(
      useCase.execute({
        id: '00000000-0000-4000-8000-000000000000',
        reviewerId: '00000000-0000-4000-8000-000000000099',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
