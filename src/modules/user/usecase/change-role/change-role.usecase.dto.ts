import { IsEnum } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { UserRole } from '@/modules/@shared/domain/enums';
import { UserDto } from '../../facade/user.facade.dto';

export class ChangeRoleUseCaseInputDto {
  id: string;

  @IsEnum(UserRole, { message: 'Função inválida' })
  role: UserRole;
}

export type ChangeRoleUseCaseOutputDto = UserDto;

export interface ChangeRoleUseCaseInterface extends BaseUseCase<
  ChangeRoleUseCaseInputDto,
  ChangeRoleUseCaseOutputDto
> {
  execute(data: ChangeRoleUseCaseInputDto): Promise<ChangeRoleUseCaseOutputDto>;
}
