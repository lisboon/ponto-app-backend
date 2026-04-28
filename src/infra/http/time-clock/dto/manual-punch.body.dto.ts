import { IsDateString, IsEnum, IsOptional, Length } from 'class-validator';
import { PunchType } from '@/modules/@shared/domain/enums';

export class ManualPunchBodyDto {
  @IsEnum(PunchType, { message: 'punchType inválido' })
  punchType: PunchType;

  @IsDateString({}, { message: 'punchedAt inválido (ISO yyyy-mm-ddTHH:MM:SS)' })
  punchedAt: string;

  @Length(0, 500, { message: 'A nota manual não pode exceder 500 caracteres' })
  @IsOptional()
  manualNote?: string;
}
