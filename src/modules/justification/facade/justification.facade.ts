import { CreateJustificationUseCaseInterface } from '../usecase/create/create.usecase.dto';
import { FindByIdJustificationUseCaseInterface } from '../usecase/find-by-id/find-by-id.usecase.dto';
import { UpdateJustificationUseCaseInterface } from '../usecase/update/update.usecase.dto';
import { ApproveJustificationUseCaseInterface } from '../usecase/approve/approve.usecase.dto';
import { RejectJustificationUseCaseInterface } from '../usecase/reject/reject.usecase.dto';
import { ListJustificationsUseCaseInterface } from '../usecase/list/list.usecase.dto';
import {
  ApproveJustificationFacadeInputDto,
  ApproveJustificationFacadeOutputDto,
  CreateJustificationFacadeInputDto,
  CreateJustificationFacadeOutputDto,
  FindByIdJustificationFacadeInputDto,
  FindByIdJustificationFacadeOutputDto,
  JustificationDto,
  JustificationFacadeInterface,
  ListJustificationsFacadeInputDto,
  ListJustificationsFacadeOutputDto,
  RejectJustificationFacadeInputDto,
  RejectJustificationFacadeOutputDto,
  UpdateJustificationFacadeInputDto,
  UpdateJustificationFacadeOutputDto,
} from './justification.facade.dto';

export default class JustificationFacade implements JustificationFacadeInterface {
  constructor(
    private readonly createUseCase: CreateJustificationUseCaseInterface,
    private readonly findByIdUseCase: FindByIdJustificationUseCaseInterface,
    private readonly updateUseCase: UpdateJustificationUseCaseInterface,
    private readonly approveUseCase: ApproveJustificationUseCaseInterface,
    private readonly rejectUseCase: RejectJustificationUseCaseInterface,
    private readonly listUseCase: ListJustificationsUseCaseInterface,
  ) {}

  create(
    data: CreateJustificationFacadeInputDto,
  ): Promise<CreateJustificationFacadeOutputDto> {
    return this.createUseCase.execute(data);
  }

  async findById(
    data: FindByIdJustificationFacadeInputDto,
  ): Promise<FindByIdJustificationFacadeOutputDto> {
    const j = await this.findByIdUseCase.execute(data);
    return j.toJSON() as JustificationDto;
  }

  update(
    data: UpdateJustificationFacadeInputDto,
  ): Promise<UpdateJustificationFacadeOutputDto> {
    return this.updateUseCase.execute(data);
  }

  approve(
    data: ApproveJustificationFacadeInputDto,
  ): Promise<ApproveJustificationFacadeOutputDto> {
    return this.approveUseCase.execute(data);
  }

  reject(
    data: RejectJustificationFacadeInputDto,
  ): Promise<RejectJustificationFacadeOutputDto> {
    return this.rejectUseCase.execute(data);
  }

  list(
    data: ListJustificationsFacadeInputDto,
  ): Promise<ListJustificationsFacadeOutputDto> {
    return this.listUseCase.execute(data);
  }
}
