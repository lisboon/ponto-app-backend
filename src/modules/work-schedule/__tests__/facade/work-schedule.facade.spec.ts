import WorkScheduleFacade from '../../facade/work-schedule.facade';
import { WorkSchedule } from '../../domain/work-schedule.entity';
import { WeeklySchedule } from '../../domain/types/schedule-data.shape';

const week = (): WeeklySchedule => ({
  sunday: null,
  monday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  tuesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  wednesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  thursday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  friday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  saturday: null,
});

const makeSut = () => {
  const createUseCase = { execute: jest.fn() };
  const findByIdUseCase = { execute: jest.fn() };
  const updateUseCase = { execute: jest.fn() };
  const deleteUseCase = { execute: jest.fn() };
  const listUseCase = { execute: jest.fn() };

  const facade = new WorkScheduleFacade(
    createUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
    listUseCase,
  );

  return {
    facade,
    createUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
    listUseCase,
  };
};

describe('WorkScheduleFacade', () => {
  it('create encaminha pro use case', async () => {
    const { facade, createUseCase } = makeSut();
    createUseCase.execute.mockResolvedValue({ id: '1' });
    await facade.create({ name: 'X', scheduleData: week() });
    expect(createUseCase.execute).toHaveBeenCalled();
  });

  it('findById serializa via toJSON', async () => {
    const { facade, findByIdUseCase } = makeSut();
    const ws = WorkSchedule.create({ name: 'Padrão', scheduleData: week() });
    findByIdUseCase.execute.mockResolvedValue(ws);
    const out = await facade.findById({ id: ws.id });
    expect(out.id).toBe(ws.id);
    expect(out.name).toBe('Padrão');
  });

  it('update / delete / list encaminham', async () => {
    const sut = makeSut();
    sut.updateUseCase.execute.mockResolvedValue({});
    sut.deleteUseCase.execute.mockResolvedValue({ id: 'x' });
    sut.listUseCase.execute.mockResolvedValue({ items: [], total: 0 });

    await sut.facade.update({ id: 'x' });
    await sut.facade.delete({ id: 'x' });
    await sut.facade.list({});

    expect(sut.updateUseCase.execute).toHaveBeenCalled();
    expect(sut.deleteUseCase.execute).toHaveBeenCalled();
    expect(sut.listUseCase.execute).toHaveBeenCalled();
  });
});
