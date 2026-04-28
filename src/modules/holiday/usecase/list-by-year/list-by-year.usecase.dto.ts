import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { HolidayDto } from '../../facade/holiday.facade.dto';

export class ListByYearHolidayUseCaseInputDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Ano inválido' })
  @Min(1900, { message: 'Ano deve ser >= 1900' })
  @Max(2100, { message: 'Ano deve ser <= 2100' })
  year: number;
}

export interface ListByYearHolidayUseCaseOutputDto {
  items: HolidayDto[];
  year: number;
}

export interface ListByYearHolidayUseCaseInterface extends BaseUseCase<
  ListByYearHolidayUseCaseInputDto,
  ListByYearHolidayUseCaseOutputDto
> {
  execute(
    data: ListByYearHolidayUseCaseInputDto,
  ): Promise<ListByYearHolidayUseCaseOutputDto>;
}
