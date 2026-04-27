import { UserGateway } from '../../gateway/user.gateway';
import { User } from '../../domain/user.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  DeleteUserUseCaseInputDto,
  DeleteUserUseCaseInterface,
  DeleteUserUseCaseOutputDto,
} from './delete-user.usecase.dto';

export default class DeleteUserUseCase implements DeleteUserUseCaseInterface {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(
    data: DeleteUserUseCaseInputDto,
  ): Promise<DeleteUserUseCaseOutputDto> {
    const user = await this.userGateway.findById(data.id);
    if (!user) {
      throw new NotFoundError(data.id, User);
    }

    user.delete();
    await this.userGateway.update(user);

    return { id: user.id };
  }
}
