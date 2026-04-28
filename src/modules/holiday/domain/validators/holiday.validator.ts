import { IsBoolean, IsDate, IsEnum, IsOptional, Length } from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { HolidayType } from '@/modules/@shared/domain/enums';
import { Holiday } from '../holiday.entity';

export class HolidayRules {
  @Length(2, 120, {
    message: 'O nome deve ter entre 2 e 120 caracteres',
    groups: ['create', 'name', 'update'],
  })
  name: string;

  @IsDate({
    message: 'Data inválida',
    groups: ['create', 'update'],
  })
  date: Date;

  @IsEnum(HolidayType, {
    message: 'Tipo de feriado inválido',
    groups: ['create', 'update'],
  })
  type: HolidayType;

  @IsOptional({ groups: ['create', 'update'] })
  @Length(0, 500, {
    message: 'A descrição não pode exceder 500 caracteres',
    groups: ['create', 'update'],
  })
  description?: string;

  @IsBoolean({
    message: 'isRecurring deve ser booleano',
    groups: ['create', 'update'],
  })
  isRecurring: boolean;

  constructor(data: Holiday) {
    this.name = data.name;
    this.date = data.date;
    this.type = data.type;
    this.description = data.description;
    this.isRecurring = data.isRecurring;
  }
}

export class HolidayValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Holiday,
    fields: string[],
  ): boolean {
    const rules = new HolidayRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class HolidayValidatorFactory {
  static create(): HolidayValidator {
    return new HolidayValidator();
  }
}
