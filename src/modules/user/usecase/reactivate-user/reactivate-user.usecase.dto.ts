import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { UserDto } from '../../facade/user.facade.dto';

export interface ReactivateUserUseCaseInputDto {
  id: string;
}

export type ReactivateUserUseCaseOutputDto = UserDto;

export interface ReactivateUserUseCaseInterface extends BaseUseCase<
  ReactivateUserUseCaseInputDto,
  ReactivateUserUseCaseOutputDto
> {
  execute(
    data: ReactivateUserUseCaseInputDto,
  ): Promise<ReactivateUserUseCaseOutputDto>;
}
