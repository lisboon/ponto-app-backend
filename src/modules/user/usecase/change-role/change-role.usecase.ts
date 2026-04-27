import { UserGateway } from '../../gateway/user.gateway';
import { User } from '../../domain/user.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { UserDto } from '../../facade/user.facade.dto';
import {
  ChangeRoleUseCaseInputDto,
  ChangeRoleUseCaseInterface,
} from './change-role.usecase.dto';

export default class ChangeRoleUseCase implements ChangeRoleUseCaseInterface {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(data: ChangeRoleUseCaseInputDto): Promise<UserDto> {
    const user = await this.userGateway.findById(data.id);
    if (!user) {
      throw new NotFoundError(data.id, User);
    }

    user.changeRole(data.role);
    await this.userGateway.update(user);

    return user.toJSON();
  }
}
