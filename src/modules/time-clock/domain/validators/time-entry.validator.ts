import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { PunchType } from '@/modules/@shared/domain/enums';
import { TimeEntry } from '../time-entry.entity';

export class TimeEntryRules {
  @IsUUID('4', { message: 'workDayId inválido', groups: ['create'] })
  workDayId: string;

  @IsEnum(PunchType, { message: 'punchType inválido', groups: ['create'] })
  punchType: PunchType;

  @IsDate({ message: 'punchedAt inválido', groups: ['create'] })
  punchedAt: Date;

  @IsOptional({ groups: ['create'] })
  @IsString({ message: 'ipAddress inválido', groups: ['create'] })
  ipAddress?: string;

  @IsOptional({ groups: ['create'] })
  @IsString({ message: 'userAgent inválido', groups: ['create'] })
  userAgent?: string;

  @IsBoolean({ message: 'outsideStudio inválido', groups: ['create'] })
  outsideStudio: boolean;

  @IsBoolean({ message: 'isManual inválido', groups: ['create'] })
  isManual: boolean;

  @IsOptional({ groups: ['create'] })
  @Length(0, 500, {
    message: 'A nota manual não pode exceder 500 caracteres',
    groups: ['create'],
  })
  manualNote?: string;

  constructor(data: TimeEntry) {
    this.workDayId = data.workDayId;
    this.punchType = data.punchType;
    this.punchedAt = data.punchedAt;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.outsideStudio = data.outsideStudio;
    this.isManual = data.isManual;
    this.manualNote = data.manualNote;
  }
}

export class TimeEntryValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: TimeEntry,
    fields: string[],
  ): boolean {
    const rules = new TimeEntryRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class TimeEntryValidatorFactory {
  static create(): TimeEntryValidator {
    return new TimeEntryValidator();
  }
}
