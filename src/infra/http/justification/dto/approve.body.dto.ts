import { IsOptional, Length } from 'class-validator';

export class ApproveJustificationBodyDto {
  @Length(0, 500, { message: 'A nota não pode exceder 500 caracteres' })
  @IsOptional()
  reviewNote?: string;
}
