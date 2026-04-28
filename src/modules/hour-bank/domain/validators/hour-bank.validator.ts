import { IsUUID } from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { HourBank } from '../hour-bank.entity';

export class HourBankRules {
  @IsUUID('4', { message: 'userId inválido', groups: ['create'] })
  userId: string;

  constructor(data: HourBank) {
    this.userId = data.userId;
  }
}

export class HourBankValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: HourBank,
    fields: string[],
  ): boolean {
    const rules = new HourBankRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class HourBankValidatorFactory {
  static create(): HourBankValidator {
    return new HourBankValidator();
  }
}
