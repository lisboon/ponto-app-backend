import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { UserDto } from '../../facade/user.facade.dto';

export interface DeactivateUserUseCaseInputDto {
  id: string;
}

export type DeactivateUserUseCaseOutputDto = UserDto;

export interface DeactivateUserUseCaseInterface extends BaseUseCase<
  DeactivateUserUseCaseInputDto,
  DeactivateUserUseCaseOutputDto
> {
  execute(
    data: DeactivateUserUseCaseInputDto,
  ): Promise<DeactivateUserUseCaseOutputDto>;
}
