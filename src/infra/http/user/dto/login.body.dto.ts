import { IsEmail, IsString, Length } from 'class-validator';

export class LoginBodyDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @Length(1, 128, { message: 'A senha deve ter entre 1 e 128 caracteres' })
  password: string;
}
