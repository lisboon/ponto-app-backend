import { Inject, Injectable } from '@nestjs/common';
import UserFacade from '@/modules/user/facade/user.facade';
import {
  AssignWorkScheduleFacadeInputDto,
  ChangeRoleFacadeInputDto,
  DeactivateUserFacadeInputDto,
  DeleteUserFacadeInputDto,
  FindByIdFacadeInputDto,
  ListUsersFacadeInputDto,
  LoginFacadeInputDto,
  ReactivateUserFacadeInputDto,
  RegisterFacadeInputDto,
  UpdateProfileFacadeInputDto,
} from '@/modules/user/facade/user.facade.dto';

@Injectable()
export class UserService {
  @Inject(UserFacade)
  private readonly userFacade: UserFacade;

  register(input: RegisterFacadeInputDto) {
    return this.userFacade.register(input);
  }

  login(input: LoginFacadeInputDto) {
    return this.userFacade.login(input);
  }

  findById(input: FindByIdFacadeInputDto) {
    return this.userFacade.findById(input);
  }

  updateProfile(input: UpdateProfileFacadeInputDto) {
    return this.userFacade.updateProfile(input);
  }

  changeRole(input: ChangeRoleFacadeInputDto) {
    return this.userFacade.changeRole(input);
  }

  assignWorkSchedule(input: AssignWorkScheduleFacadeInputDto) {
    return this.userFacade.assignWorkSchedule(input);
  }

  list(input: ListUsersFacadeInputDto) {
    return this.userFacade.list(input);
  }

  deactivate(input: DeactivateUserFacadeInputDto) {
    return this.userFacade.deactivate(input);
  }

  reactivate(input: ReactivateUserFacadeInputDto) {
    return this.userFacade.reactivate(input);
  }

  delete(input: DeleteUserFacadeInputDto) {
    return this.userFacade.delete(input);
  }
}
