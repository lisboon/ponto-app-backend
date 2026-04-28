import RevokeMedicalLeaveUseCase from '../../../usecase/revoke/revoke.usecase';
import { MedicalLeave } from '../../../domain/medical-leave.entity';
import { WorkDay } from '@/modules/time-clock/domain/work-day.entity';
import { DayStatus } from '@/modules/@shared/domain/enums';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';

const ML_ID = '00000000-0000-4000-8000-0000000000ml'.replace(
  /[^0-9a-f-]/g,
  '0',
);

const buildMl = () =>
  MedicalLeave.create({
    userId: '00000000-0000-4000-8000-000000000001',
    createdBy: '00000000-0000-4000-8000-000000000002',
    startDate: new Date(2026, 4, 5),
    endDate: new Date(2026, 4, 6),
    attachmentUrl: 'https://files.studio.local/atestado.pdf',
  });

describe('RevokeMedicalLeaveUseCase', () => {
  it('revoga + reverte WorkDays para OPEN', async () => {
    const ml = buildMl();
    const day1 = WorkDay.create({
      userId: ml.userId,
      date: ml.startDate,
      expectedMinutes: 0,
    });
    day1.markMedicalLeave(ml.id);
    const day2 = WorkDay.create({
      userId: ml.userId,
      date: ml.endDate,
      expectedMinutes: 0,
    });
    day2.markMedicalLeave(ml.id);

    const mlGateway = {
      findById: jest.fn().mockResolvedValue(ml),
      listByUser: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const timeClockGateway = {
      findDay: jest
        .fn()
        .mockResolvedValueOnce(day1)
        .mockResolvedValueOnce(day2),
      findDayById: jest.fn(),
      saveDay: jest.fn().mockResolvedValue(undefined),
      appendPunch: jest.fn(),
      searchHistory: jest.fn(),
    };
    const userGateway = {
      findById: jest
        .fn()
        .mockResolvedValue({ id: ml.userId, workScheduleId: undefined }),
      findByEmail: jest.fn(),
      existsByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      search: jest.fn(),
    };
    const workScheduleGateway = {
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      search: jest.fn(),
    };
    const holidayGateway = {
      findById: jest.fn(),
      findByDate: jest.fn().mockResolvedValue(null),
      listByYear: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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

    const useCase = new RevokeMedicalLeaveUseCase(
      mlGateway as any,
      timeClockGateway as any,
      userGateway as any,
      workScheduleGateway as any,
      holidayGateway as any,
      trx as any,
      dispatcher as any,
    );

    const out = await useCase.execute({
      id: ML_ID,
      revokedBy: '00000000-0000-4000-8000-000000000099',
    });

    expect(out.revokedAt).toBeInstanceOf(Date);
    expect(mlGateway.update).toHaveBeenCalledTimes(1);
    expect(timeClockGateway.saveDay).toHaveBeenCalledTimes(2);
    const calls = (timeClockGateway.saveDay as jest.Mock).mock.calls;
    for (const [day] of calls) {
      expect(day.status).toBe(DayStatus.OPEN);
      expect(day.medicalLeaveId).toBeUndefined();
    }
    expect(dispatcher.dispatch).toHaveBeenCalledTimes(1);
  });

  it('NotFoundError quando atestado não existe', async () => {
    const mlGateway = {
      findById: jest.fn().mockResolvedValue(null),
      listByUser: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    const useCase = new RevokeMedicalLeaveUseCase(
      mlGateway as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    await expect(
      useCase.execute({
        id: '00000000-0000-4000-8000-000000000000',
        revokedBy: '00000000-0000-4000-8000-000000000099',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
