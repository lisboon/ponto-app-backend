import prisma from '@/infra/database/prisma.instance';
import HolidayRepository from '../repository/holiday.repository';
import CreateHolidayUseCase from '../usecase/create/create.usecase';
import FindByIdHolidayUseCase from '../usecase/find-by-id/find-by-id.usecase';
import UpdateHolidayUseCase from '../usecase/update/update.usecase';
import DeleteHolidayUseCase from '../usecase/delete/delete.usecase';
import ListByYearHolidayUseCase from '../usecase/list-by-year/list-by-year.usecase';
import HolidayFacade from '../facade/holiday.facade';

export default class HolidayFacadeFactory {
  static create() {
    const repository = new HolidayRepository(prisma);

    const createUseCase = new CreateHolidayUseCase(repository);
    const findByIdUseCase = new FindByIdHolidayUseCase(repository);
    const updateUseCase = new UpdateHolidayUseCase(repository);
    const deleteUseCase = new DeleteHolidayUseCase(repository);
    const listByYearUseCase = new ListByYearHolidayUseCase(repository);

    return new HolidayFacade(
      createUseCase,
      findByIdUseCase,
      updateUseCase,
      deleteUseCase,
      listByYearUseCase,
    );
  }
}
