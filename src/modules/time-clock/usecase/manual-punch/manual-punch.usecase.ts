import { TimeClockGateway } from '../../gateway/time-clock.gateway';
import { TimeEntry } from '../../domain/time-entry.entity';
import {
  assertChronological,
  assertExpectedType,
} from '../../domain/services/punch-state-machine.service';
import { UserGateway } from '@/modules/user/gateway/user.gateway';
import { WorkScheduleGateway } from '@/modules/work-schedule/gateway/work-schedule.gateway';
import { HolidayGateway } from '@/modules/holiday/gateway/holiday.gateway';
import { TransactionManager } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { EventDispatcherInterface } from '@/modules/@shared/domain/events/event-dispatcher.interface';
import { resolveExpectedMinutes } from '../_shared/resolve-expected-minutes';
import { getOrCreateDay, dayKey } from '../_shared/get-or-create-day';
import { TimeEntryDto, WorkDayDto } from '../../facade/time-clock.facade.dto';
import {
  ManualPunchUseCaseInputDto,
  ManualPunchUseCaseInterface,
  ManualPunchUseCaseOutputDto,
} from './manual-punch.usecase.dto';

export default class ManualPunchUseCase implements ManualPunchUseCaseInterface {
  constructor(
    private readonly timeClockGateway: TimeClockGateway,
    private readonly userGateway: UserGateway,
    private readonly workScheduleGateway: WorkScheduleGateway,
    private readonly holidayGateway: HolidayGateway,
    private readonly transactionManager: TransactionManager,
    private readonly eventDispatcher: EventDispatcherInterface,
  ) {}

  async execute(
    data: ManualPunchUseCaseInputDto,
  ): Promise<ManualPunchUseCaseOutputDto> {
    const punchedAt = new Date(data.punchedAt);
    const day0 = dayKey(punchedAt);

    const { expectedMinutes, holiday } = await resolveExpectedMinutes(
      data.userId,
      day0,
      this.userGateway,
      this.workScheduleGateway,
      this.holidayGateway,
    );

    const { day } = await getOrCreateDay(
      data.userId,
      day0,
      expectedMinutes,
      holiday,
      this.timeClockGateway,
    );

    assertExpectedType(day.punches, data.punchType);
    assertChronological(day.punches, punchedAt);

    const entry = TimeEntry.create({
      workDayId: day.id,
      punchType: data.punchType,
      punchedAt,
      isManual: true,
      manualNote: data.manualNote,
      outsideStudio: false,
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
