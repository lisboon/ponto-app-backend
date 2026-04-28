import HolidayFacade from '../../facade/holiday.facade';
import { Holiday } from '../../domain/holiday.entity';
import { HolidayType } from '@/modules/@shared/domain/enums';

const makeSut = () => {
  const createUseCase = { execute: jest.fn() };
  const findByIdUseCase = { execute: jest.fn() };
  const updateUseCase = { execute: jest.fn() };
  const deleteUseCase = { execute: jest.fn() };
  const listByYearUseCase = { execute: jest.fn() };

  const facade = new HolidayFacade(
    createUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
    listByYearUseCase,
  );

  return {
    facade,
    createUseCase,
    findByIdUseCase,
    updateUseCase,
    deleteUseCase,
    listByYearUseCase,
  };
};

describe('HolidayFacade', () => {
  it('create encaminha pro use case', async () => {
    const { facade, createUseCase } = makeSut();
    createUseCase.execute.mockResolvedValue({ id: '1' });
    await facade.create({
      name: 'Ano Novo',
      date: '2026-01-01',
      type: HolidayType.NATIONAL,
    });
    expect(createUseCase.execute).toHaveBeenCalled();
  });

  it('findById serializa via toJSON', async () => {
    const { facade, findByIdUseCase } = makeSut();
    const h = Holiday.create({
      name: 'Ano Novo',
      date: new Date('2026-01-01'),
      type: HolidayType.NATIONAL,
      isRecurring: true,
    });
    findByIdUseCase.execute.mockResolvedValue(h);
    const out = await facade.findById({ id: h.id });
    expect(out.id).toBe(h.id);
    expect(out.name).toBe('Ano Novo');
    expect(out.isRecurring).toBe(true);
  });

  it('update / delete / listByYear encaminham', async () => {
    const sut = makeSut();
    sut.updateUseCase.execute.mockResolvedValue({});
    sut.deleteUseCase.execute.mockResolvedValue({ id: 'x' });
    sut.listByYearUseCase.execute.mockResolvedValue({ items: [], year: 2026 });

    await sut.facade.update({ id: 'x' });
    await sut.facade.delete({ id: 'x' });
    await sut.facade.listByYear({ year: 2026 });

    expect(sut.updateUseCase.execute).toHaveBeenCalled();
    expect(sut.deleteUseCase.execute).toHaveBeenCalled();
    expect(sut.listByYearUseCase.execute).toHaveBeenCalled();
  });
});
