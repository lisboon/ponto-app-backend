import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { SortDirection } from '@/modules/@shared/repository/search-params';
import { UserRole } from '@/modules/@shared/domain/enums';
import { UserDto } from '../../facade/user.facade.dto';

export class ListUsersUseCaseInputDto {
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

  @IsString({ message: 'Campo de ordenação inválido' })
  @IsOptional()
  sort?: string;

  @IsString({ message: 'Direção de ordenação inválida' })
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

export interface ListUsersUseCaseOutputDto {
  items: UserDto[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface ListUsersUseCaseInterface extends BaseUseCase<
  ListUsersUseCaseInputDto,
  ListUsersUseCaseOutputDto
> {
  execute(data: ListUsersUseCaseInputDto): Promise<ListUsersUseCaseOutputDto>;
}
