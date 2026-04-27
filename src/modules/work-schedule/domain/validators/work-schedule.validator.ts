import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Length,
  Matches,
  Min,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { WorkSchedule } from '../work-schedule.entity';
import {
  parseTimeToMinutes,
  TIME_REGEX,
  WEEKDAYS,
} from '../types/schedule-data.shape';

function EndAfterStart(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'EndAfterStart',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const obj = args.object as DayScheduleRules;
          if (!obj.start || !obj.end) return true;
          if (!TIME_REGEX.test(obj.start) || !TIME_REGEX.test(obj.end))
            return true;
          return parseTimeToMinutes(obj.end) > parseTimeToMinutes(obj.start);
        },
        defaultMessage() {
          return 'O horário final deve ser maior que o inicial';
        },
      },
    });
  };
}

export class DayScheduleRules {
  @Matches(TIME_REGEX, {
    message: 'Horário inicial inválido (esperado HH:MM)',
    groups: ['create', 'update'],
  })
  start: string;

  @Matches(TIME_REGEX, {
    message: 'Horário final inválido (esperado HH:MM)',
    groups: ['create', 'update'],
  })
  @EndAfterStart({ groups: ['create', 'update'] })
  end: string;

  @IsInt({
    message: 'O intervalo (breakMinutes) deve ser inteiro',
    groups: ['create', 'update'],
  })
  @Min(0, {
    message: 'O intervalo não pode ser negativo',
    groups: ['create', 'update'],
  })
  breakMinutes: number;
}

export class WeeklyScheduleRules {
  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => DayScheduleRules)
  sunday: DayScheduleRules | null;

  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => DayScheduleRules)
  monday: DayScheduleRules | null;

  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => DayScheduleRules)
  tuesday: DayScheduleRules | null;

  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => DayScheduleRules)
  wednesday: DayScheduleRules | null;

  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => DayScheduleRules)
  thursday: DayScheduleRules | null;

  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => DayScheduleRules)
  friday: DayScheduleRules | null;

  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => DayScheduleRules)
  saturday: DayScheduleRules | null;
}

export class WorkScheduleRules {
  @Length(2, 100, {
    message: 'O nome deve ter entre 2 e 100 caracteres',
    groups: ['create', 'name', 'update'],
  })
  name: string;

  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => WeeklyScheduleRules)
  scheduleData: WeeklyScheduleRules;

  constructor(data: WorkSchedule) {
    this.name = data.name;

    const raw = data.scheduleData;
    const weekly = new WeeklyScheduleRules();
    for (const wd of WEEKDAYS) {
      const day = raw[wd];
      if (day === null) {
        weekly[wd] = null;
        continue;
      }
      const rule = new DayScheduleRules();
      rule.start = day.start;
      rule.end = day.end;
      rule.breakMinutes = day.breakMinutes;
      weekly[wd] = rule;
    }
    this.scheduleData = weekly;
  }
}

export class WorkScheduleValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: WorkSchedule,
    fields: string[],
  ): boolean {
    const rules = new WorkScheduleRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class WorkScheduleValidatorFactory {
  static create(): WorkScheduleValidator {
    return new WorkScheduleValidator();
  }
}
