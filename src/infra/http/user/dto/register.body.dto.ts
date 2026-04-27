import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ContractType, UserRole } from '@/modules/@shared/domain/enums';

export class RegisterBodyDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @Length(2, 255, { message: 'O nome deve ter entre 2 e 255 caracteres' })
  name: string;

  @Length(8, 128, { message: 'A senha deve ter entre 8 e 128 caracteres' })
  password: string;

  @IsEnum(UserRole, { message: 'Função inválida' })
  @IsOptional()
  role?: UserRole;

  @Length(1, 120, { message: 'O cargo deve ter entre 1 e 120 caracteres' })
  @IsOptional()
  position?: string;

  @IsEnum(ContractType, { message: 'Tipo de contrato inválido' })
  @IsOptional()
  contractType?: ContractType;

  @IsInt({ message: 'A jornada semanal deve ser um inteiro de minutos' })
  @Min(0, { message: 'A jornada semanal não pode ser negativa' })
  @Max(10080, { message: 'A jornada semanal não pode exceder 10080 minutos' })
  @IsOptional()
  weeklyMinutes?: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor/hora deve ter até 2 casas decimais' },
  )
  @Min(0, { message: 'O valor/hora não pode ser negativo' })
  @IsOptional()
  hourlyRate?: number;

  @IsDateString({}, { message: 'Data de admissão inválida' })
  @IsOptional()
  hireDate?: string;

  @IsUUID('4', { message: 'workScheduleId inválido' })
  @IsOptional()
  workScheduleId?: string;
}
