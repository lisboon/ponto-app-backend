import { Inject, Injectable } from '@nestjs/common';
import TimeClockFacade from '@/modules/time-clock/facade/time-clock.facade';
import {
  CloseDayFacadeInputDto,
  FindDayByDateFacadeInputDto,
  ListHistoryFacadeInputDto,
  ManualPunchFacadeInputDto,
  PunchFacadeInputDto,
  RecalculateDayFacadeInputDto,
} from '@/modules/time-clock/facade/time-clock.facade.dto';

@Injectable()
export class TimeClockService {
  @Inject(TimeClockFacade)
  private readonly facade: TimeClockFacade;

  punch(input: PunchFacadeInputDto) {
    return this.facade.punch(input);
  }

  manualPunch(input: ManualPunchFacadeInputDto) {
    return this.facade.manualPunch(input);
  }

  findDayByDate(input: FindDayByDateFacadeInputDto) {
    return this.facade.findDayByDate(input);
  }

  listHistory(input: ListHistoryFacadeInputDto) {
    return this.facade.listHistory(input);
  }

  recalculateDay(input: RecalculateDayFacadeInputDto) {
    return this.facade.recalculateDay(input);
  }

  closeDay(input: CloseDayFacadeInputDto) {
    return this.facade.closeDay(input);
  }
}
