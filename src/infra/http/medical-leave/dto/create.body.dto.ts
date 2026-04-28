import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

/** `createdBy` vem do JWT. */
export class CreateMedicalLeaveBodyDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsDateString({}, { message: 'startDate inválido (esperado ISO yyyy-mm-dd)' })
  startDate: string;

  @IsDateString({}, { message: 'endDate inválido (esperado ISO yyyy-mm-dd)' })
  endDate: string;

  @IsNotEmpty({ message: 'attachmentUrl é obrigatório' })
  attachmentUrl: string;

  @Length(0, 1000, {
    message: 'A justificativa não pode exceder 1000 caracteres',
  })
  @IsOptional()
  reason?: string;
}
