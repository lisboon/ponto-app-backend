import prisma from '@/infra/database/prisma.instance';
import { EventDispatcher } from '@/modules/@shared/domain/events/event-dispatcher';
import UserRepository from '@/modules/user/repository/user.repository';
import WorkScheduleRepository from '@/modules/work-schedule/repository/work-schedule.repository';
import HolidayRepository from '@/modules/holiday/repository/holiday.repository';
import TimeClockRepository from '@/modules/time-clock/repository/time-clock.repository';
import RecalculateDayUseCase from '@/modules/time-clock/usecase/recalculate-day/recalculate-day.usecase';
import { JustificationApprovedHandler } from '../event/handlers/justification-approved.handler';
import JustificationRepository from '../repository/justification.repository';
import CreateJustificationUseCase from '../usecase/create/create.usecase';
import FindByIdJustificationUseCase from '../usecase/find-by-id/find-by-id.usecase';
import UpdateJustificationUseCase from '../usecase/update/update.usecase';
import ApproveJustificationUseCase from '../usecase/approve/approve.usecase';
import RejectJustificationUseCase from '../usecase/reject/reject.usecase';
import ListJustificationsUseCase from '../usecase/list/list.usecase';
import JustificationFacade from '../facade/justification.facade';

export const justificationEventDispatcher = new EventDispatcher();

function registerHandlers(): void {
  const timeClockRepo = new TimeClockRepository(prisma);
  const userRepo = new UserRepository(prisma);
  const workScheduleRepo = new WorkScheduleRepository(prisma);
  const holidayRepo = new HolidayRepository(prisma);
  const recalcUseCase = new RecalculateDayUseCase(
    timeClockRepo,
    userRepo,
    workScheduleRepo,
    holidayRepo,
  );
  justificationEventDispatcher.register(
    'JustificationApprovedEvent',
    new JustificationApprovedHandler(timeClockRepo, recalcUseCase),
  );
}

registerHandlers();

export default class JustificationFacadeFactory {
  static create() {
    const repository = new JustificationRepository(prisma);

    const createUseCase = new CreateJustificationUseCase(repository);
    const findByIdUseCase = new FindByIdJustificationUseCase(repository);
    const updateUseCase = new UpdateJustificationUseCase(repository);
    const approveUseCase = new ApproveJustificationUseCase(
      repository,
      justificationEventDispatcher,
    );
    const rejectUseCase = new RejectJustificationUseCase(
      repository,
      justificationEventDispatcher,
    );
    const listUseCase = new ListJustificationsUseCase(repository);

    return new JustificationFacade(
      createUseCase,
      findByIdUseCase,
      updateUseCase,
      approveUseCase,
      rejectUseCase,
      listUseCase,
    );
  }
}
