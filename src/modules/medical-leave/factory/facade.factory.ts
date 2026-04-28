import prisma from '@/infra/database/prisma.instance';
import { EventDispatcher } from '@/modules/@shared/domain/events/event-dispatcher';
import { PrismaTransactionManager } from '@/infra/database/prisma-transaction.manager';
import UserRepository from '@/modules/user/repository/user.repository';
import WorkScheduleRepository from '@/modules/work-schedule/repository/work-schedule.repository';
import HolidayRepository from '@/modules/holiday/repository/holiday.repository';
import TimeClockRepository from '@/modules/time-clock/repository/time-clock.repository';
import MedicalLeaveRepository from '../repository/medical-leave.repository';
import CreateMedicalLeaveUseCase from '../usecase/create/create.usecase';
import FindByIdMedicalLeaveUseCase from '../usecase/find-by-id/find-by-id.usecase';
import ListByUserMedicalLeaveUseCase from '../usecase/list-by-user/list-by-user.usecase';
import RevokeMedicalLeaveUseCase from '../usecase/revoke/revoke.usecase';
import MedicalLeaveFacade from '../facade/medical-leave.facade';

export const medicalLeaveEventDispatcher = new EventDispatcher();

export default class MedicalLeaveFacadeFactory {
  static create() {
    const repository = new MedicalLeaveRepository(prisma);
    const timeClockRepository = new TimeClockRepository(prisma);
    const userRepository = new UserRepository(prisma);
    const workScheduleRepository = new WorkScheduleRepository(prisma);
    const holidayRepository = new HolidayRepository(prisma);
    const transactionManager = new PrismaTransactionManager(prisma);

    const createUseCase = new CreateMedicalLeaveUseCase(
      repository,
      timeClockRepository,
      transactionManager,
      medicalLeaveEventDispatcher,
    );
    const findByIdUseCase = new FindByIdMedicalLeaveUseCase(repository);
    const listByUserUseCase = new ListByUserMedicalLeaveUseCase(repository);
    const revokeUseCase = new RevokeMedicalLeaveUseCase(
      repository,
      timeClockRepository,
      userRepository,
      workScheduleRepository,
      holidayRepository,
      transactionManager,
      medicalLeaveEventDispatcher,
    );

    return new MedicalLeaveFacade(
      createUseCase,
      findByIdUseCase,
      listByUserUseCase,
      revokeUseCase,
    );
  }
}
