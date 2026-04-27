import { UserGateway } from '../../gateway/user.gateway';
import { User } from '../../domain/user.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { UserDto } from '../../facade/user.facade.dto';
import {
  DeactivateUserUseCaseInputDto,
  DeactivateUserUseCaseInterface,
} from './deactivate-user.usecase.dto';

export default class DeactivateUserUseCase implements DeactivateUserUseCaseInterface {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(data: DeactivateUserUseCaseInputDto): Promise<UserDto> {
    const user = await this.userGateway.findById(data.id);
    if (!user) {
      throw new NotFoundError(data.id, User);
    }

    user.deactivate();
    await this.userGateway.update(user);

    return user.toJSON();
  }
}
