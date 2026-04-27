import { FindByIdUseCaseInterface } from '../usecase/find-by-id/find-by-id.usecase.dto';
import { RegisterUseCaseInterface } from '../usecase/register/register.usecase.dto';
import { LoginUseCaseInterface } from '../usecase/login/login.usecase.dto';
import { UpdateProfileUseCaseInterface } from '../usecase/update-profile/update-profile.usecase.dto';
import { ChangeRoleUseCaseInterface } from '../usecase/change-role/change-role.usecase.dto';
import { AssignWorkScheduleUseCaseInterface } from '../usecase/assign-work-schedule/assign-work-schedule.usecase.dto';
import { ListUsersUseCaseInterface } from '../usecase/list-users/list-users.usecase.dto';
import { DeactivateUserUseCaseInterface } from '../usecase/deactivate-user/deactivate-user.usecase.dto';
import { ReactivateUserUseCaseInterface } from '../usecase/reactivate-user/reactivate-user.usecase.dto';
import { DeleteUserUseCaseInterface } from '../usecase/delete-user/delete-user.usecase.dto';
import {
  AssignWorkScheduleFacadeInputDto,
  AssignWorkScheduleFacadeOutputDto,
  ChangeRoleFacadeInputDto,
  ChangeRoleFacadeOutputDto,
  DeactivateUserFacadeInputDto,
  DeactivateUserFacadeOutputDto,
  DeleteUserFacadeInputDto,
  DeleteUserFacadeOutputDto,
  FindByIdFacadeInputDto,
  FindByIdFacadeOutputDto,
  ListUsersFacadeInputDto,
  ListUsersFacadeOutputDto,
  LoginFacadeInputDto,
  LoginFacadeOutputDto,
  ReactivateUserFacadeInputDto,
  ReactivateUserFacadeOutputDto,
  RegisterFacadeInputDto,
  RegisterFacadeOutputDto,
  UpdateProfileFacadeInputDto,
  UpdateProfileFacadeOutputDto,
  UserFacadeInterface,
} from './user.facade.dto';

export default class UserFacade implements UserFacadeInterface {
  constructor(
    private readonly findByIdUseCase: FindByIdUseCaseInterface,
    private readonly registerUseCase: RegisterUseCaseInterface,
    private readonly loginUseCase: LoginUseCaseInterface,
    private readonly updateProfileUseCase: UpdateProfileUseCaseInterface,
    private readonly changeRoleUseCase: ChangeRoleUseCaseInterface,
    private readonly assignWorkScheduleUseCase: AssignWorkScheduleUseCaseInterface,
    private readonly listUsersUseCase: ListUsersUseCaseInterface,
    private readonly deactivateUserUseCase: DeactivateUserUseCaseInterface,
    private readonly reactivateUserUseCase: ReactivateUserUseCaseInterface,
    private readonly deleteUserUseCase: DeleteUserUseCaseInterface,
  ) {}

  async register(
    data: RegisterFacadeInputDto,
  ): Promise<RegisterFacadeOutputDto> {
    return this.registerUseCase.execute(data);
  }

  async login(data: LoginFacadeInputDto): Promise<LoginFacadeOutputDto> {
    return this.loginUseCase.execute(data);
  }

  async findById(
    data: FindByIdFacadeInputDto,
  ): Promise<FindByIdFacadeOutputDto> {
    const user = await this.findByIdUseCase.execute(data);
    return user.toJSON();
  }

  async updateProfile(
    data: UpdateProfileFacadeInputDto,
  ): Promise<UpdateProfileFacadeOutputDto> {
    return this.updateProfileUseCase.execute(data);
  }

  async changeRole(
    data: ChangeRoleFacadeInputDto,
  ): Promise<ChangeRoleFacadeOutputDto> {
    return this.changeRoleUseCase.execute(data);
  }

  async assignWorkSchedule(
    data: AssignWorkScheduleFacadeInputDto,
  ): Promise<AssignWorkScheduleFacadeOutputDto> {
    return this.assignWorkScheduleUseCase.execute(data);
  }

  async list(data: ListUsersFacadeInputDto): Promise<ListUsersFacadeOutputDto> {
    return this.listUsersUseCase.execute(data);
  }

  async deactivate(
    data: DeactivateUserFacadeInputDto,
  ): Promise<DeactivateUserFacadeOutputDto> {
    return this.deactivateUserUseCase.execute(data);
  }

  async reactivate(
    data: ReactivateUserFacadeInputDto,
  ): Promise<ReactivateUserFacadeOutputDto> {
    return this.reactivateUserUseCase.execute(data);
  }

  async delete(
    data: DeleteUserFacadeInputDto,
  ): Promise<DeleteUserFacadeOutputDto> {
    return this.deleteUserUseCase.execute(data);
  }
}
