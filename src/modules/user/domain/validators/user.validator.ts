import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { ContractType, UserRole } from '@/modules/@shared/domain/enums';
import { User } from '../user.entity';

export class UserRules {
  @IsEmail(
    {},
    {
      message: 'E-mail inválido',
      groups: ['create', 'email', 'update'],
    },
  )
  email: string;

  @Length(2, 255, {
    message: 'O nome deve ter entre 2 e 255 caracteres',
    groups: ['create', 'name', 'update'],
  })
  name: string;

  @IsNotEmpty({
    message: 'A senha é obrigatória',
    groups: ['create', 'password'],
  })
  password: string;

  @IsEnum(UserRole, {
    message: 'Função inválida',
    groups: ['create', 'role', 'update'],
  })
  role: UserRole;

  @IsOptional({ groups: ['create', 'update'] })
  @Length(1, 120, {
    message: 'O cargo deve ter entre 1 e 120 caracteres',
    groups: ['create', 'update'],
  })
  position?: string;

  @IsOptional({ groups: ['create', 'update'] })
  @IsEnum(ContractType, {
    message: 'Tipo de contrato inválido',
    groups: ['create', 'update'],
  })
  contractType?: ContractType;

  @IsOptional({ groups: ['create', 'update'] })
  @IsInt({
    message: 'A jornada semanal deve ser um inteiro de minutos',
    groups: ['create', 'update'],
  })
  @Min(0, {
    message: 'A jornada semanal não pode ser negativa',
    groups: ['create', 'update'],
  })
  @Max(10080, {
    message: 'A jornada semanal não pode exceder 10080 minutos',
    groups: ['create', 'update'],
  })
  weeklyMinutes?: number;

  @IsOptional({ groups: ['create', 'update'] })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'O valor/hora deve ser um número com até 2 casas decimais',
      groups: ['create', 'update'],
    },
  )
  @Min(0, {
    message: 'O valor/hora não pode ser negativo',
    groups: ['create', 'update'],
  })
  hourlyRate?: number;

  @IsOptional({ groups: ['create', 'update'] })
  @IsDate({
    message: 'Data de admissão inválida',
    groups: ['create', 'update'],
  })
  hireDate?: Date;

  constructor(data: User) {
    Object.assign(this, data.toJSON());
    this.password = data.password;
  }
}

export class UserValidator extends ClassValidatorFields {
  validate(notification: Notification, data: User, fields: string[]): boolean {
    const rules = new UserRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
