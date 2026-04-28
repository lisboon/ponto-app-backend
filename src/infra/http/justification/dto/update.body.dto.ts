import { IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateJustificationBodyDto {
  @Length(3, 1000, {
    message: 'A descrição deve ter entre 3 e 1000 caracteres',
  })
  @IsOptional()
  description?: string;

  @IsUrl({ require_tld: false }, { message: 'attachmentUrl inválido' })
  @IsOptional()
  attachmentUrl?: string;
}
