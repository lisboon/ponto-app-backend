import { IsOptional, IsUUID, IsUrl, Length } from 'class-validator';

/**
 * Body DTO de criação. `createdBy` vem do JWT, não do payload — por isso
 * não está aqui.
 */
export class CreateJustificationBodyDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsUUID('4', { message: 'workDayId inválido' })
  workDayId: string;

  @Length(3, 1000, {
    message: 'A descrição deve ter entre 3 e 1000 caracteres',
  })
  description: string;

  @IsUrl({ require_tld: false }, { message: 'attachmentUrl inválido' })
  @IsOptional()
  attachmentUrl?: string;
}
