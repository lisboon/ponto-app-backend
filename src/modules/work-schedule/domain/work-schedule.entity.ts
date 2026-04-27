import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import {
  parseTimeToMinutes,
  Weekday,
  WeeklySchedule,
  weekdayOf,
} from './types/schedule-data.shape';
import WorkScheduleValidatorFactory from './validators/work-schedule.validator';

export interface WorkScheduleProps {
  id?: string;
  name: string;
  scheduleData: WeeklySchedule;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class WorkSchedule extends BaseEntity {
  private _name: string;
  private _scheduleData: WeeklySchedule;

  constructor(props: WorkScheduleProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._name = props.name;
    this._scheduleData = props.scheduleData;
  }

  get name(): string {
    return this._name;
  }

  get scheduleData(): WeeklySchedule {
    return this._scheduleData;
  }

  changeName(name: string) {
    this._name = name;
  }

  changeScheduleData(scheduleData: WeeklySchedule) {
    this._scheduleData = scheduleData;
  }

  expectedMinutesForWeekday(weekday: Weekday): number {
    const day = this._scheduleData[weekday];
    if (day === null) return 0;
    const start = parseTimeToMinutes(day.start);
    const end = parseTimeToMinutes(day.end);
    return Math.max(0, end - start - day.breakMinutes);
  }

  expectedMinutesForDate(date: Date): number {
    return this.expectedMinutesForWeekday(weekdayOf(date));
  }

  updateSchedule(
    props: Partial<Pick<WorkScheduleProps, 'name' | 'scheduleData'>>,
  ) {
    if (props.name !== undefined) this._name = props.name;
    if (props.scheduleData !== undefined)
      this._scheduleData = props.scheduleData;

    this.update();
    this.validate(['update']);

    if (this.notification.hasErrors()) {
      throw new EntityValidationError(this.notification.toJSON());
    }
  }

  validate(fields?: string[]): void {
    const validator = WorkScheduleValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  static create(props: WorkScheduleProps): WorkSchedule {
    const schedule = new WorkSchedule(props);
    schedule.validate();

    if (schedule.notification.hasErrors()) {
      throw new EntityValidationError(schedule.notification.toJSON());
    }

    return schedule;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      scheduleData: this._scheduleData,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
