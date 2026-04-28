import { PunchUseCaseInterface } from '../usecase/punch/punch.usecase.dto';
import { ManualPunchUseCaseInterface } from '../usecase/manual-punch/manual-punch.usecase.dto';
import { FindDayByDateUseCaseInterface } from '../usecase/find-day-by-date/find-day-by-date.usecase.dto';
import { ListHistoryUseCaseInterface } from '../usecase/list-history/list-history.usecase.dto';
import { RecalculateDayUseCaseInterface } from '../usecase/recalculate-day/recalculate-day.usecase.dto';
import { CloseDayUseCaseInterface } from '../usecase/close-day/close-day.usecase.dto';
import {
  CloseDayFacadeInputDto,
  CloseDayFacadeOutputDto,
  FindDayByDateFacadeInputDto,
  FindDayByDateFacadeOutputDto,
  ListHistoryFacadeInputDto,
  ListHistoryFacadeOutputDto,
  ManualPunchFacadeInputDto,
  ManualPunchFacadeOutputDto,
  PunchFacadeInputDto,
  PunchFacadeOutputDto,
  RecalculateDayFacadeInputDto,
  RecalculateDayFacadeOutputDto,
  TimeClockFacadeInterface,
} from './time-clock.facade.dto';

export default class TimeClockFacade implements TimeClockFacadeInterface {
  constructor(
    private readonly punchUseCase: PunchUseCaseInterface,
    private readonly manualPunchUseCase: ManualPunchUseCaseInterface,
    private readonly findDayUseCase: FindDayByDateUseCaseInterface,
    private readonly listHistoryUseCase: ListHistoryUseCaseInterface,
    private readonly recalculateUseCase: RecalculateDayUseCaseInterface,
    private readonly closeDayUseCase: CloseDayUseCaseInterface,
  ) {}

  punch(data: PunchFacadeInputDto): Promise<PunchFacadeOutputDto> {
    return this.punchUseCase.execute(data);
  }

  manualPunch(
    data: ManualPunchFacadeInputDto,
  ): Promise<ManualPunchFacadeOutputDto> {
    return this.manualPunchUseCase.execute(data);
  }

  findDayByDate(
    data: FindDayByDateFacadeInputDto,
  ): Promise<FindDayByDateFacadeOutputDto> {
    return this.findDayUseCase.execute(data);
  }

  listHistory(
    data: ListHistoryFacadeInputDto,
  ): Promise<ListHistoryFacadeOutputDto> {
    return this.listHistoryUseCase.execute(data);
  }

  recalculateDay(
    data: RecalculateDayFacadeInputDto,
  ): Promise<RecalculateDayFacadeOutputDto> {
    return this.recalculateUseCase.execute(data);
  }

  closeDay(data: CloseDayFacadeInputDto): Promise<CloseDayFacadeOutputDto> {
    return this.closeDayUseCase.execute(data);
  }
}
