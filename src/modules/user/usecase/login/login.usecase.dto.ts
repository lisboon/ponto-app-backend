import { IsEmail, IsString, Length } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { UserRole } from '@/modules/@shared/domain/enums';

export class LoginUseCaseInputDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @Length(1, 128, { message: 'A senha deve ter entre 1 e 128 caracteres' })
  password: string;
}

export interface LoginUseCaseOutputDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface LoginUseCaseInterface extends BaseUseCase<
  LoginUseCaseInputDto,
  LoginUseCaseOutputDto
> {
  execute(data: LoginUseCaseInputDto): Promise<LoginUseCaseOutputDto>;
}
