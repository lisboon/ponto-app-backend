import { IsEnum, IsOptional, IsUUID, Length, IsUrl } from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { JustificationStatus } from '@/modules/@shared/domain/enums';
import { Justification } from '../justification.entity';

export class JustificationRules {
  @IsUUID('4', {
    message: 'userId inválido',
    groups: ['create', 'update'],
  })
  userId: string;

  @IsUUID('4', {
    message: 'workDayId inválido',
    groups: ['create', 'update'],
  })
  workDayId: string;

  @IsUUID('4', {
    message: 'createdBy inválido',
    groups: ['create'],
  })
  createdBy: string;

  @Length(3, 1000, {
    message: 'A descrição deve ter entre 3 e 1000 caracteres',
    groups: ['create', 'update'],
  })
  description: string;

  @IsOptional({ groups: ['create', 'update'] })
  @IsUrl(
    { require_tld: false },
    {
      message: 'attachmentUrl inválido',
      groups: ['create', 'update'],
    },
  )
  attachmentUrl?: string;

  @IsEnum(JustificationStatus, {
    message: 'Status inválido',
    groups: ['create', 'review'],
  })
  status: JustificationStatus;

  constructor(data: Justification) {
    this.userId = data.userId;
    this.workDayId = data.workDayId;
    this.createdBy = data.createdBy;
    this.description = data.description;
    this.attachmentUrl = data.attachmentUrl;
    this.status = data.status;
  }
}

export class JustificationValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Justification,
    fields: string[],
  ): boolean {
    const rules = new JustificationRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class JustificationValidatorFactory {
  static create(): JustificationValidator {
    return new JustificationValidator();
  }
}
