import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { HolidayType } from '@/modules/@shared/domain/enums';

export class UpdateHolidayBodyDto {
  @Length(2, 120, { message: 'O nome deve ter entre 2 e 120 caracteres' })
  @IsOptional()
  name?: string;

  @IsDateString({}, { message: 'Data inválida (esperado ISO yyyy-mm-dd)' })
  @IsOptional()
  date?: string;

  @IsEnum(HolidayType, { message: 'Tipo de feriado inválido' })
  @IsOptional()
  type?: HolidayType;

  @Length(0, 500, { message: 'A descrição não pode exceder 500 caracteres' })
  @IsOptional()
  description?: string;

  @IsBoolean({ message: 'isRecurring deve ser booleano' })
  @IsOptional()
  isRecurring?: boolean;
}
