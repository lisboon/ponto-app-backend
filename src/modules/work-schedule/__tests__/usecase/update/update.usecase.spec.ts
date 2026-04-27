import UpdateWorkScheduleUseCase from '../../../usecase/update/update.usecase';
import { WorkSchedule } from '../../../domain/work-schedule.entity';
import { WeeklySchedule } from '../../../domain/types/schedule-data.shape';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';

const businessWeek = (): WeeklySchedule => ({
  sunday: null,
  monday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  tuesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  wednesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  thursday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  friday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  saturday: null,
});

describe('UpdateWorkScheduleUseCase', () => {
  it('atualiza nome quando jornada existe', async () => {
    const ws = WorkSchedule.create({
      name: 'Antiga',
      scheduleData: businessWeek(),
    });
    const gateway = {
      findById: jest.fn().mockResolvedValue(ws),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      search: jest.fn(),
    };
    const useCase = new UpdateWorkScheduleUseCase(gateway);

    const out = await useCase.execute({ id: ws.id, name: 'Nova' });

    expect(out.name).toBe('Nova');
    expect(gateway.update).toHaveBeenCalledWith(ws);
  });

  it('NotFoundError quando jornada não existe', async () => {
    const gateway = {
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      search: jest.fn(),
    };
    const useCase = new UpdateWorkScheduleUseCase(gateway);
    await expect(
      useCase.execute({ id: '00000000-0000-4000-8000-000000000000' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
