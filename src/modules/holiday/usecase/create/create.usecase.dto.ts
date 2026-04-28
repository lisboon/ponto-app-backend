import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { HolidayType } from '@/modules/@shared/domain/enums';
import { HolidayDto } from '../../facade/holiday.facade.dto';

export class CreateHolidayUseCaseInputDto {
  @Length(2, 120, { message: 'O nome deve ter entre 2 e 120 caracteres' })
  name: string;

  @IsDateString({}, { message: 'Data inválida (esperado ISO yyyy-mm-dd)' })
  date: string;

  @IsEnum(HolidayType, { message: 'Tipo de feriado inválido' })
  type: HolidayType;

  @Length(0, 500, { message: 'A descrição não pode exceder 500 caracteres' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'isRecurring deve ser booleano' })
  @IsOptional()
  isRecurring?: boolean;
}

export type CreateHolidayUseCaseOutputDto = HolidayDto;

export interface CreateHolidayUseCaseInterface extends BaseUseCase<
  CreateHolidayUseCaseInputDto,
  CreateHolidayUseCaseOutputDto
> {
  execute(
    data: CreateHolidayUseCaseInputDto,
  ): Promise<CreateHolidayUseCaseOutputDto>;
}
