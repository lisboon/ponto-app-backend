import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { JustificationStatus } from '@/modules/@shared/domain/enums';
import { SortDirection } from '@/modules/@shared/repository/search-params';
import { JustificationDto } from '../../facade/justification.facade.dto';

export class ListJustificationsUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  @IsOptional()
  userId?: string;

  @IsUUID('4', { message: 'workDayId inválido' })
  @IsOptional()
  workDayId?: string;

  @IsEnum(JustificationStatus, { message: 'status inválido' })
  @IsOptional()
  status?: JustificationStatus;

  @IsIn(['createdAt', 'updatedAt', 'status'], {
    message: 'Campo de ordenação inválido',
  })
  @IsOptional()
  sort?: string;

  @IsIn(['asc', 'desc'], { message: 'Direção de ordenação inválida' })
  @IsOptional()
  sortDir?: SortDirection;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'page inválida' })
  @Min(1, { message: 'page deve ser >= 1' })
  @IsOptional()
  page?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'perPage inválido' })
  @Min(1, { message: 'perPage deve ser >= 1' })
  @IsOptional()
  perPage?: number;
}

export interface ListJustificationsUseCaseOutputDto {
  items: JustificationDto[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface ListJustificationsUseCaseInterface extends BaseUseCase<
  ListJustificationsUseCaseInputDto,
  ListJustificationsUseCaseOutputDto
> {
  execute(
    data: ListJustificationsUseCaseInputDto,
  ): Promise<ListJustificationsUseCaseOutputDto>;
}
