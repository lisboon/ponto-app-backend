import CreateWorkScheduleUseCase from '../../../usecase/create/create.usecase';
import { WeeklyScheduleInputDto } from '../../../usecase/create/create.usecase.dto';

const businessWeek = (): WeeklyScheduleInputDto => {
  const w = new WeeklyScheduleInputDto();
  w.sunday = null;
  w.monday = { start: '09:00', end: '18:00', breakMinutes: 60 };
  w.tuesday = { start: '09:00', end: '18:00', breakMinutes: 60 };
  w.wednesday = { start: '09:00', end: '18:00', breakMinutes: 60 };
  w.thursday = { start: '09:00', end: '18:00', breakMinutes: 60 };
  w.friday = { start: '09:00', end: '18:00', breakMinutes: 60 };
  w.saturday = null;
  return w;
};

describe('CreateWorkScheduleUseCase', () => {
  it('cria e persiste a jornada', async () => {
    const gateway = {
      findById: jest.fn(),
      create: jest.fn().mockResolvedValue(undefined),
      update: jest.fn(),
      search: jest.fn(),
    };
    const useCase = new CreateWorkScheduleUseCase(gateway);

    const out = await useCase.execute({
      name: 'Padrão',
      scheduleData: businessWeek(),
    });

    expect(gateway.create).toHaveBeenCalledTimes(1);
    expect(out.name).toBe('Padrão');
    expect(out.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
