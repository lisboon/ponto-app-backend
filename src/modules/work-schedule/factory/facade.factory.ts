import prisma from '@/infra/database/prisma.instance';
import WorkScheduleRepository from '../repository/work-schedule.repository';
import CreateWorkScheduleUseCase from '../usecase/create/create.usecase';
import FindByIdWorkScheduleUseCase from '../usecase/find-by-id/find-by-id.usecase';
import UpdateWorkScheduleUseCase from '../usecase/update/update.usecase';
import DeleteWorkScheduleUseCase from '../usecase/delete/delete.usecase';
import ListWorkSchedulesUseCase from '../usecase/list/list.usecase';
import WorkScheduleFacade from '../facade/work-schedule.facade';

export default class WorkScheduleFacadeFactory {
  static create() {
    const repository = new WorkScheduleRepository(prisma);

    const createUseCase = new CreateWorkScheduleUseCase(repository);
    const findByIdUseCase = new FindByIdWorkScheduleUseCase(repository);
    const updateUseCase = new UpdateWorkScheduleUseCase(repository);
    const deleteUseCase = new DeleteWorkScheduleUseCase(repository);
    const listUseCase = new ListWorkSchedulesUseCase(repository);

    return new WorkScheduleFacade(
      createUseCase,
      findByIdUseCase,
      updateUseCase,
      deleteUseCase,
      listUseCase,
    );
  }
}
