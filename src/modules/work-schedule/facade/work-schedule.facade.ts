import { CreateWorkScheduleUseCaseInterface } from '../usecase/create/create.usecase.dto';
import { FindByIdWorkScheduleUseCaseInterface } from '../usecase/find-by-id/find-by-id.usecase.dto';
import { UpdateWorkScheduleUseCaseInterface } from '../usecase/update/update.usecase.dto';
import { DeleteWorkScheduleUseCaseInterface } from '../usecase/delete/delete.usecase.dto';
import { ListWorkSchedulesUseCaseInterface } from '../usecase/list/list.usecase.dto';
import {
  CreateWorkScheduleFacadeInputDto,
  CreateWorkScheduleFacadeOutputDto,
  DeleteWorkScheduleFacadeInputDto,
  DeleteWorkScheduleFacadeOutputDto,
  FindByIdWorkScheduleFacadeInputDto,
  FindByIdWorkScheduleFacadeOutputDto,
  ListWorkSchedulesFacadeInputDto,
  ListWorkSchedulesFacadeOutputDto,
  UpdateWorkScheduleFacadeInputDto,
  UpdateWorkScheduleFacadeOutputDto,
  WorkScheduleFacadeInterface,
} from './work-schedule.facade.dto';

export default class WorkScheduleFacade implements WorkScheduleFacadeInterface {
  constructor(
    private readonly createUseCase: CreateWorkScheduleUseCaseInterface,
    private readonly findByIdUseCase: FindByIdWorkScheduleUseCaseInterface,
    private readonly updateUseCase: UpdateWorkScheduleUseCaseInterface,
    private readonly deleteUseCase: DeleteWorkScheduleUseCaseInterface,
    private readonly listUseCase: ListWorkSchedulesUseCaseInterface,
  ) {}

  async create(
    data: CreateWorkScheduleFacadeInputDto,
  ): Promise<CreateWorkScheduleFacadeOutputDto> {
    return this.createUseCase.execute(data);
  }

  async findById(
    data: FindByIdWorkScheduleFacadeInputDto,
  ): Promise<FindByIdWorkScheduleFacadeOutputDto> {
    const schedule = await this.findByIdUseCase.execute(data);
    return schedule.toJSON();
  }

  async update(
    data: UpdateWorkScheduleFacadeInputDto,
  ): Promise<UpdateWorkScheduleFacadeOutputDto> {
    return this.updateUseCase.execute(data);
  }

  async delete(
    data: DeleteWorkScheduleFacadeInputDto,
  ): Promise<DeleteWorkScheduleFacadeOutputDto> {
    return this.deleteUseCase.execute(data);
  }

  async list(
    data: ListWorkSchedulesFacadeInputDto,
  ): Promise<ListWorkSchedulesFacadeOutputDto> {
    return this.listUseCase.execute(data);
  }
}
