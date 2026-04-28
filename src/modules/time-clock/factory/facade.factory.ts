import prisma from '@/infra/database/prisma.instance';
import { PrismaTransactionManager } from '@/infra/database/prisma-transaction.manager';
import { EventDispatcher } from '@/modules/@shared/domain/events/event-dispatcher';
import UserRepository from '@/modules/user/repository/user.repository';
import WorkScheduleRepository from '@/modules/work-schedule/repository/work-schedule.repository';
import HolidayRepository from '@/modules/holiday/repository/holiday.repository';
import TimeClockRepository from '../repository/time-clock.repository';
import PunchUseCase from '../usecase/punch/punch.usecase';
import ManualPunchUseCase from '../usecase/manual-punch/manual-punch.usecase';
import FindDayByDateUseCase from '../usecase/find-day-by-date/find-day-by-date.usecase';
import ListHistoryUseCase from '../usecase/list-history/list-history.usecase';
import RecalculateDayUseCase from '../usecase/recalculate-day/recalculate-day.usecase';
import CloseDayUseCase from '../usecase/close-day/close-day.usecase';
import TimeClockFacade from '../facade/time-clock.facade';

const eventDispatcher = new EventDispatcher();

export { eventDispatcher as timeClockEventDispatcher };

export default class TimeClockFacadeFactory {
  static create() {
    const repository = new TimeClockRepository(prisma);
    const userRepository = new UserRepository(prisma);
    const workScheduleRepository = new WorkScheduleRepository(prisma);
    const holidayRepository = new HolidayRepository(prisma);
    const transactionManager = new PrismaTransactionManager(prisma);

    const punchUseCase = new PunchUseCase(
      repository,
      userRepository,
      workScheduleRepository,
      holidayRepository,
      transactionManager,
      eventDispatcher,
    );
    const manualPunchUseCase = new ManualPunchUseCase(
      repository,
      userRepository,
      workScheduleRepository,
      holidayRepository,
      transactionManager,
      eventDispatcher,
    );
    const findDayUseCase = new FindDayByDateUseCase(repository);
    const listHistoryUseCase = new ListHistoryUseCase(repository);
    const recalculateUseCase = new RecalculateDayUseCase(
      repository,
      userRepository,
      workScheduleRepository,
      holidayRepository,
    );
    const closeDayUseCase = new CloseDayUseCase(repository, eventDispatcher);

    return new TimeClockFacade(
      punchUseCase,
      manualPunchUseCase,
      findDayUseCase,
      listHistoryUseCase,
      recalculateUseCase,
      closeDayUseCase,
    );
  }
}
