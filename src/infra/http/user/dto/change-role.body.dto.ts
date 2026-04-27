import { IsEnum } from 'class-validator';
import { UserRole } from '@/modules/@shared/domain/enums';

export class ChangeRoleBodyDto {
  @IsEnum(UserRole, { message: 'Função inválida' })
  role: UserRole;
}
