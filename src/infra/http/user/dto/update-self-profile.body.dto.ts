import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateSelfProfileBodyDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @Length(2, 255, { message: 'O nome deve ter entre 2 e 255 caracteres' })
  @IsOptional()
  name?: string;

  @Length(8, 128, { message: 'A senha deve ter entre 8 e 128 caracteres' })
  @IsOptional()
  password?: string;

  @IsOptional()
  avatarUrl?: string;
}
