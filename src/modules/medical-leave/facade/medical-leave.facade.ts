import { CreateMedicalLeaveUseCaseInterface } from '../usecase/create/create.usecase.dto';
import { FindByIdMedicalLeaveUseCaseInterface } from '../usecase/find-by-id/find-by-id.usecase.dto';
import { ListByUserMedicalLeaveUseCaseInterface } from '../usecase/list-by-user/list-by-user.usecase.dto';
import { RevokeMedicalLeaveUseCaseInterface } from '../usecase/revoke/revoke.usecase.dto';
import {
  CreateMedicalLeaveFacadeInputDto,
  CreateMedicalLeaveFacadeOutputDto,
  FindByIdMedicalLeaveFacadeInputDto,
  FindByIdMedicalLeaveFacadeOutputDto,
  ListByUserMedicalLeaveFacadeInputDto,
  ListByUserMedicalLeaveFacadeOutputDto,
  MedicalLeaveDto,
  MedicalLeaveFacadeInterface,
  RevokeMedicalLeaveFacadeInputDto,
  RevokeMedicalLeaveFacadeOutputDto,
} from './medical-leave.facade.dto';

export default class MedicalLeaveFacade implements MedicalLeaveFacadeInterface {
  constructor(
    private readonly createUseCase: CreateMedicalLeaveUseCaseInterface,
    private readonly findByIdUseCase: FindByIdMedicalLeaveUseCaseInterface,
    private readonly listByUserUseCase: ListByUserMedicalLeaveUseCaseInterface,
    private readonly revokeUseCase: RevokeMedicalLeaveUseCaseInterface,
  ) {}

  create(
    data: CreateMedicalLeaveFacadeInputDto,
  ): Promise<CreateMedicalLeaveFacadeOutputDto> {
    return this.createUseCase.execute(data);
  }

  async findById(
    data: FindByIdMedicalLeaveFacadeInputDto,
  ): Promise<FindByIdMedicalLeaveFacadeOutputDto> {
    const ml = await this.findByIdUseCase.execute(data);
    return ml.toJSON() as MedicalLeaveDto;
  }

  listByUser(
    data: ListByUserMedicalLeaveFacadeInputDto,
  ): Promise<ListByUserMedicalLeaveFacadeOutputDto> {
    return this.listByUserUseCase.execute(data);
  }

  revoke(
    data: RevokeMedicalLeaveFacadeInputDto,
  ): Promise<RevokeMedicalLeaveFacadeOutputDto> {
    return this.revokeUseCase.execute(data);
  }
}
