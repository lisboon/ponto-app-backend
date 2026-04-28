import { CreateHolidayUseCaseInterface } from '../usecase/create/create.usecase.dto';
import { FindByIdHolidayUseCaseInterface } from '../usecase/find-by-id/find-by-id.usecase.dto';
import { UpdateHolidayUseCaseInterface } from '../usecase/update/update.usecase.dto';
import { DeleteHolidayUseCaseInterface } from '../usecase/delete/delete.usecase.dto';
import { ListByYearHolidayUseCaseInterface } from '../usecase/list-by-year/list-by-year.usecase.dto';
import {
  CreateHolidayFacadeInputDto,
  CreateHolidayFacadeOutputDto,
  DeleteHolidayFacadeInputDto,
  DeleteHolidayFacadeOutputDto,
  FindByIdHolidayFacadeInputDto,
  FindByIdHolidayFacadeOutputDto,
  HolidayFacadeInterface,
  ListByYearHolidayFacadeInputDto,
  ListByYearHolidayFacadeOutputDto,
  UpdateHolidayFacadeInputDto,
  UpdateHolidayFacadeOutputDto,
} from './holiday.facade.dto';

export default class HolidayFacade implements HolidayFacadeInterface {
  constructor(
    private readonly createUseCase: CreateHolidayUseCaseInterface,
    private readonly findByIdUseCase: FindByIdHolidayUseCaseInterface,
    private readonly updateUseCase: UpdateHolidayUseCaseInterface,
    private readonly deleteUseCase: DeleteHolidayUseCaseInterface,
    private readonly listByYearUseCase: ListByYearHolidayUseCaseInterface,
  ) {}

  async create(
    data: CreateHolidayFacadeInputDto,
  ): Promise<CreateHolidayFacadeOutputDto> {
    return this.createUseCase.execute(data);
  }

  async findById(
    data: FindByIdHolidayFacadeInputDto,
  ): Promise<FindByIdHolidayFacadeOutputDto> {
    const holiday = await this.findByIdUseCase.execute(data);
    return holiday.toJSON();
  }

  async update(
    data: UpdateHolidayFacadeInputDto,
  ): Promise<UpdateHolidayFacadeOutputDto> {
    return this.updateUseCase.execute(data);
  }

  async delete(
    data: DeleteHolidayFacadeInputDto,
  ): Promise<DeleteHolidayFacadeOutputDto> {
    return this.deleteUseCase.execute(data);
  }

  async listByYear(
    data: ListByYearHolidayFacadeInputDto,
  ): Promise<ListByYearHolidayFacadeOutputDto> {
    return this.listByYearUseCase.execute(data);
  }
}
