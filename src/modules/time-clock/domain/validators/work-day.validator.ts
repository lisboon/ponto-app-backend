import { IsDate, IsEnum, IsUUID } from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { DayStatus } from '@/modules/@shared/domain/enums';
import { WorkDay } from '../work-day.entity';

export class WorkDayRules {
  @IsUUID('4', { message: 'userId inválido', groups: ['create'] })
  userId: string;

  @IsDate({ message: 'date inválida', groups: ['create'] })
  date: Date;

  @IsEnum(DayStatus, { message: 'status inválido', groups: ['create'] })
  status: DayStatus;

  constructor(data: WorkDay) {
    this.userId = data.userId;
    this.date = data.date;
    this.status = data.status;
  }
}

export class WorkDayValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: WorkDay,
    fields: string[],
  ): boolean {
    const rules = new WorkDayRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class WorkDayValidatorFactory {
  static create(): WorkDayValidator {
    return new WorkDayValidator();
  }
}
