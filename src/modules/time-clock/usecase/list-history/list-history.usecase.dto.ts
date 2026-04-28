import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { DayStatus } from '@/modules/@shared/domain/enums';
import { ListHistoryFacadeOutputDto } from '../../facade/time-clock.facade.dto';

export class ListHistoryUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsDateString({}, { message: 'fromDate inválida (esperado ISO yyyy-mm-dd)' })
  @IsOptional()
  fromDate?: string;

  @IsDateString({}, { message: 'toDate inválida (esperado ISO yyyy-mm-dd)' })
  @IsOptional()
  toDate?: string;

  @IsEnum(DayStatus, { message: 'status inválido' })
  @IsOptional()
  status?: DayStatus;

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

export type ListHistoryUseCaseOutputDto = ListHistoryFacadeOutputDto;

export interface ListHistoryUseCaseInterface extends BaseUseCase<
  ListHistoryUseCaseInputDto,
  ListHistoryUseCaseOutputDto
> {
  execute(
    data: ListHistoryUseCaseInputDto,
  ): Promise<ListHistoryUseCaseOutputDto>;
}
