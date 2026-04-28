import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { MedicalLeave } from '../medical-leave.entity';

function EndOnOrAfterStart(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'EndOnOrAfterStart',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const obj = args.object as MedicalLeaveRules;
          if (!obj.startDate || !obj.endDate) return true;
          return obj.endDate.getTime() >= obj.startDate.getTime();
        },
        defaultMessage() {
          return 'A data final deve ser maior ou igual à inicial';
        },
      },
    });
  };
}

export class MedicalLeaveRules {
  @IsUUID('4', {
    message: 'userId inválido',
    groups: ['create'],
  })
  userId: string;

  @IsUUID('4', {
    message: 'createdBy inválido',
    groups: ['create'],
  })
  createdBy: string;

  @IsDate({
    message: 'startDate inválido',
    groups: ['create'],
  })
  startDate: Date;

  @IsDate({
    message: 'endDate inválido',
    groups: ['create'],
  })
  @EndOnOrAfterStart({ groups: ['create'] })
  endDate: Date;

  @IsNotEmpty({
    message: 'attachmentUrl é obrigatório (atestado precisa de comprovação)',
    groups: ['create'],
  })
  attachmentUrl: string;

  @IsOptional({ groups: ['create'] })
  @Length(0, 1000, {
    message: 'A justificativa não pode exceder 1000 caracteres',
    groups: ['create'],
  })
  reason?: string;

  constructor(data: MedicalLeave) {
    this.userId = data.userId;
    this.createdBy = data.createdBy;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.attachmentUrl = data.attachmentUrl;
    this.reason = data.reason;
  }
}

export class MedicalLeaveValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: MedicalLeave,
    fields: string[],
  ): boolean {
    const rules = new MedicalLeaveRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class MedicalLeaveValidatorFactory {
  static create(): MedicalLeaveValidator {
    return new MedicalLeaveValidator();
  }
}
