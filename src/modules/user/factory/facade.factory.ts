import prisma from '@/infra/database/prisma.instance';
import { BcryptPasswordHashService } from '@/infra/services/bcrypt-password-hash.service';
import { JwtTokenServiceImpl } from '@/infra/services/jwt-token.service';
import UserRepository from '../repository/user.repository';
import FindByIdUseCase from '../usecase/find-by-id/find-by-id.usecase';
import RegisterUseCase from '../usecase/register/register.usecase';
import LoginUseCase from '../usecase/login/login.usecase';
import UpdateProfileUseCase from '../usecase/update-profile/update-profile.usecase';
import ChangeRoleUseCase from '../usecase/change-role/change-role.usecase';
import AssignWorkScheduleUseCase from '../usecase/assign-work-schedule/assign-work-schedule.usecase';
import ListUsersUseCase from '../usecase/list-users/list-users.usecase';
import DeactivateUserUseCase from '../usecase/deactivate-user/deactivate-user.usecase';
import ReactivateUserUseCase from '../usecase/reactivate-user/reactivate-user.usecase';
import DeleteUserUseCase from '../usecase/delete-user/delete-user.usecase';
import UserFacade from '../facade/user.facade';

export default class UserFacadeFactory {
  static create() {
    const userRepository = new UserRepository(prisma);
    const passwordHashService = new BcryptPasswordHashService();
    const jwtTokenService = new JwtTokenServiceImpl();

    const findByIdUseCase = new FindByIdUseCase(userRepository);
    const registerUseCase = new RegisterUseCase(
      userRepository,
      passwordHashService,
    );
    const loginUseCase = new LoginUseCase(
      userRepository,
      passwordHashService,
      jwtTokenService,
    );
    const updateProfileUseCase = new UpdateProfileUseCase(
      userRepository,
      passwordHashService,
    );
    const changeRoleUseCase = new ChangeRoleUseCase(userRepository);
    const assignWorkScheduleUseCase = new AssignWorkScheduleUseCase(
      userRepository,
    );
    const listUsersUseCase = new ListUsersUseCase(userRepository);
    const deactivateUserUseCase = new DeactivateUserUseCase(userRepository);
    const reactivateUserUseCase = new ReactivateUserUseCase(userRepository);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    return new UserFacade(
      findByIdUseCase,
      registerUseCase,
      loginUseCase,
      updateProfileUseCase,
      changeRoleUseCase,
      assignWorkScheduleUseCase,
      listUsersUseCase,
      deactivateUserUseCase,
      reactivateUserUseCase,
      deleteUserUseCase,
    );
  }
}
