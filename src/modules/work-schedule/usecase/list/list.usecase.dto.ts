import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { SortDirection } from '@/modules/@shared/repository/search-params';
import { WorkScheduleDto } from '../../facade/work-schedule.facade.dto';

export class ListWorkSchedulesUseCaseInputDto {
  @IsString({ message: 'Nome inválido' })
  @IsOptional()
  name?: string;

  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean({ message: 'Status active inválido' })
  @IsOptional()
  active?: boolean;

  @IsIn(['name', 'createdAt', 'updatedAt'], {
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

export interface ListWorkSchedulesUseCaseOutputDto {
  items: WorkScheduleDto[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface ListWorkSchedulesUseCaseInterface extends BaseUseCase<
  ListWorkSchedulesUseCaseInputDto,
  ListWorkSchedulesUseCaseOutputDto
> {
  execute(
    data: ListWorkSchedulesUseCaseInputDto,
  ): Promise<ListWorkSchedulesUseCaseOutputDto>;
}
