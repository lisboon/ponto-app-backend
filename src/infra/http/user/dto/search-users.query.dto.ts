import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UserRole } from '@/modules/@shared/domain/enums';
import { SortDirection } from '@/modules/@shared/repository/search-params';

export class SearchUsersQueryDto {
  @IsString({ message: 'Nome inválido' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @IsEnum(UserRole, { message: 'Função inválida' })
  @IsOptional()
  role?: UserRole;

  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean({ message: 'Status active inválido' })
  @IsOptional()
  active?: boolean;

  @IsIn(['name', 'email', 'role', 'createdAt', 'updatedAt'], {
    message: 'Campo de ordenação inválido',
  })
  @IsOptional()
  sort?: string;

  @IsIn(['asc', 'desc'], { message: 'Direção de ordenação inválida' })
  @IsOptional()
  sortDir?: SortDirection;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Página inválida' })
  @Min(1, { message: 'Página deve ser >= 1' })
  @IsOptional()
  page?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Itens por página inválido' })
  @Min(1, { message: 'perPage deve ser >= 1' })
  @IsOptional()
  perPage?: number;
}
