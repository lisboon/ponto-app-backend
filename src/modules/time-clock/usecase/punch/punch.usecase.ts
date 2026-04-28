import { TimeClockGateway } from '../../gateway/time-clock.gateway';
import { TimeEntry } from '../../domain/time-entry.entity';
import { nextExpectedPunchType } from '../../domain/services/punch-state-machine.service';
import { UserGateway } from '@/modules/user/gateway/user.gateway';
import { WorkScheduleGateway } from '@/modules/work-schedule/gateway/work-schedule.gateway';
import { HolidayGateway } from '@/modules/holiday/gateway/holiday.gateway';
import { TransactionManager } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { EventDispatcherInterface } from '@/modules/@shared/domain/events/event-dispatcher.interface';
import { resolveExpectedMinutes } from '../_shared/resolve-expected-minutes';
import { getOrCreateDay, dayKey } from '../_shared/get-or-create-day';
import { WorkDayDto, TimeEntryDto } from '../../facade/time-clock.facade.dto';
import {
  PunchUseCaseInputDto,
  PunchUseCaseInterface,
  PunchUseCaseOutputDto,
} from './punch.usecase.dto';

export default class PunchUseCase implements PunchUseCaseInterface {
  constructor(
    private readonly timeClockGateway: TimeClockGateway,
    private readonly userGateway: UserGateway,
    private readonly workScheduleGateway: WorkScheduleGateway,
    private readonly holidayGateway: HolidayGateway,
    private readonly transactionManager: TransactionManager,
    private readonly eventDispatcher: EventDispatcherInterface,
  ) {}

  async execute(data: PunchUseCaseInputDto): Promise<PunchUseCaseOutputDto> {
    const now = new Date();
    const today = dayKey(now);

    const { expectedMinutes, holiday } = await resolveExpectedMinutes(
      data.userId,
      today,
      this.userGateway,
      this.workScheduleGateway,
      this.holidayGateway,
    );

    const { day } = await getOrCreateDay(
      data.userId,
      today,
      expectedMinutes,
      holiday,
      this.timeClockGateway,
    );

    const punchType = nextExpectedPunchType(day.punches);

    const entry = TimeEntry.create({
      workDayId: day.id,
      punchType,
      punchedAt: now,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      outsideStudio: data.outsideStudio,
      isManual: false,
    });

    day.addPunch(entry);

    await this.transactionManager.execute(async (trx) => {
      await this.timeClockGateway.saveDay(day, trx);
      await this.timeClockGateway.appendPunch(entry, trx);
    });

    for (const event of day.pullEvents()) {
      await this.eventDispatcher.dispatch(event);
    }

    return {
      workDay: day.toJSON() as WorkDayDto,
      registeredPunch: entry.toJSON() as TimeEntryDto,
    };
  }
}
