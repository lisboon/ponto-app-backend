import CreateMedicalLeaveUseCase from '../../../usecase/create/create.usecase';
import { DayStatus } from '@/modules/@shared/domain/enums';

describe('CreateMedicalLeaveUseCase', () => {
  it('persiste atestado + cria N WorkDays MEDICAL_LEAVE em transação', async () => {
    const mlGateway = {
      findById: jest.fn(),
      listByUser: jest.fn(),
      create: jest.fn().mockResolvedValue(undefined),
      update: jest.fn(),
    };
    const timeClockGateway = {
      findDay: jest.fn().mockResolvedValue(null),
      findDayById: jest.fn(),
      saveDay: jest.fn().mockResolvedValue(undefined),
      appendPunch: jest.fn(),
      searchHistory: jest.fn(),
    };
    const trx = {
      execute: jest.fn(async (fn: any) => fn(null)),
    };
    const dispatcher = {
      dispatch: jest.fn().mockResolvedValue(undefined),
      register: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
    };

    const useCase = new CreateMedicalLeaveUseCase(
      mlGateway as any,
      timeClockGateway as any,
      trx as any,
      dispatcher as any,
    );

    const out = await useCase.execute({
      userId: '00000000-0000-4000-8000-000000000001',
      createdBy: '00000000-0000-4000-8000-000000000002',
      startDate: '2026-05-05',
      endDate: '2026-05-07',
      attachmentUrl: 'https://files.studio.local/atestado.pdf',
    });

    expect(mlGateway.create).toHaveBeenCalledTimes(1);
    expect(timeClockGateway.saveDay).toHaveBeenCalledTimes(3);
    const calls = (timeClockGateway.saveDay as jest.Mock).mock.calls;
    for (const [day] of calls) {
      expect(day.status).toBe(DayStatus.MEDICAL_LEAVE);
      expect(day.medicalLeaveId).toBe(out.id);
    }
    expect(dispatcher.dispatch).toHaveBeenCalledTimes(1);
  });
});
