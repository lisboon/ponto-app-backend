import TimeClockFacade from '../../facade/time-clock.facade';
import { PunchType } from '@/modules/@shared/domain/enums';

const makeSut = () => {
  const punchUseCase = { execute: jest.fn() };
  const manualPunchUseCase = { execute: jest.fn() };
  const findDayUseCase = { execute: jest.fn() };
  const listHistoryUseCase = { execute: jest.fn() };
  const recalculateUseCase = { execute: jest.fn() };
  const closeDayUseCase = { execute: jest.fn() };

  const facade = new TimeClockFacade(
    punchUseCase as any,
    manualPunchUseCase as any,
    findDayUseCase as any,
    listHistoryUseCase as any,
    recalculateUseCase as any,
    closeDayUseCase as any,
  );

  return {
    facade,
    punchUseCase,
    manualPunchUseCase,
    findDayUseCase,
    listHistoryUseCase,
    recalculateUseCase,
    closeDayUseCase,
  };
};

describe('TimeClockFacade', () => {
  it('punch encaminha pro use case', async () => {
    const sut = makeSut();
    sut.punchUseCase.execute.mockResolvedValue({});
    await sut.facade.punch({
      userId: '00000000-0000-4000-8000-000000000001',
      outsideStudio: false,
    });
    expect(sut.punchUseCase.execute).toHaveBeenCalled();
  });

  it('manualPunch / findDay / list / recalc / close encaminham', async () => {
    const sut = makeSut();
    [
      sut.manualPunchUseCase,
      sut.findDayUseCase,
      sut.listHistoryUseCase,
      sut.recalculateUseCase,
      sut.closeDayUseCase,
    ].forEach((u) => u.execute.mockResolvedValue({}));

    await sut.facade.manualPunch({
      userId: '00000000-0000-4000-8000-000000000001',
      punchType: PunchType.CLOCK_IN,
      punchedAt: '2026-04-27T09:00:00',
    });
    await sut.facade.findDayByDate({
      userId: '00000000-0000-4000-8000-000000000001',
      date: '2026-04-27',
    });
    await sut.facade.listHistory({
      userId: '00000000-0000-4000-8000-000000000001',
    });
    await sut.facade.recalculateDay({
      userId: '00000000-0000-4000-8000-000000000001',
      date: '2026-04-27',
    });
    await sut.facade.closeDay({
      userId: '00000000-0000-4000-8000-000000000001',
      date: '2026-04-27',
    });

    expect(sut.manualPunchUseCase.execute).toHaveBeenCalled();
    expect(sut.findDayUseCase.execute).toHaveBeenCalled();
    expect(sut.listHistoryUseCase.execute).toHaveBeenCalled();
    expect(sut.recalculateUseCase.execute).toHaveBeenCalled();
    expect(sut.closeDayUseCase.execute).toHaveBeenCalled();
  });
});
