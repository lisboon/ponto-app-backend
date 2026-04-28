import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { DayStatus } from '@/modules/@shared/domain/enums';
import { TimeEntry } from './time-entry.entity';
import { calculateWorkDay } from './services/work-day-calculator.service';
import {
  assertChronological,
  assertExpectedType,
} from './services/punch-state-machine.service';
import WorkDayValidatorFactory from './validators/work-day.validator';
import { WorkDayClosedEvent } from '../event/work-day-closed.event';
import { PunchRegisteredEvent } from '../event/punch-registered.event';

export interface WorkDayProps {
  id?: string;
  userId: string;
  date: Date;
  status?: DayStatus;
  expectedMinutes?: number;
  workedMinutes?: number;
  breakMinutes?: number;
  overtimeMinutes?: number;
  hourBankDelta?: number;
  medicalLeaveId?: string;
  closedAt?: Date;
  punches?: TimeEntry[];
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class WorkDay extends BaseEntity {
  private _userId: string;
  private _date: Date;
  private _status: DayStatus;
  private _expectedMinutes?: number;
  private _workedMinutes?: number;
  private _breakMinutes?: number;
  private _overtimeMinutes?: number;
  private _hourBankDelta?: number;
  private _medicalLeaveId?: string;
  private _closedAt?: Date;
  private _punches: TimeEntry[];

  constructor(props: WorkDayProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._userId = props.userId;
    this._date = props.date;
    this._status = props.status ?? DayStatus.OPEN;
    this._expectedMinutes = props.expectedMinutes;
    this._workedMinutes = props.workedMinutes;
    this._breakMinutes = props.breakMinutes;
    this._overtimeMinutes = props.overtimeMinutes;
    this._hourBankDelta = props.hourBankDelta;
    this._medicalLeaveId = props.medicalLeaveId;
    this._closedAt = props.closedAt;
    this._punches = props.punches ?? [];
  }

  get userId(): string {
    return this._userId;
  }
  get date(): Date {
    return this._date;
  }
  get status(): DayStatus {
    return this._status;
  }
  get expectedMinutes(): number | undefined {
    return this._expectedMinutes;
  }
  get workedMinutes(): number | undefined {
    return this._workedMinutes;
  }
  get breakMinutes(): number | undefined {
    return this._breakMinutes;
  }
  get overtimeMinutes(): number | undefined {
    return this._overtimeMinutes;
  }
  get hourBankDelta(): number | undefined {
    return this._hourBankDelta;
  }
  get medicalLeaveId(): string | undefined {
    return this._medicalLeaveId;
  }
  get closedAt(): Date | undefined {
    return this._closedAt;
  }
  get punches(): readonly TimeEntry[] {
    return this._punches;
  }

  addPunch(punch: TimeEntry): void {
    if (this._status === DayStatus.CLOSED) {
      throw new EntityValidationError([
        {
          field: 'status',
          message: 'Dia já fechado, não aceita novas batidas',
        },
      ]);
    }
    if (
      this._status === DayStatus.HOLIDAY ||
      this._status === DayStatus.MEDICAL_LEAVE
    ) {
      throw new EntityValidationError([
        {
          field: 'status',
          message: 'Dias de feriado/atestado não aceitam batidas',
        },
      ]);
    }

    assertExpectedType(this._punches, punch.punchType);
    assertChronological(this._punches, punch.punchedAt);

    this._punches = [...this._punches, punch];
    this.recompute();
    this.update();

    this.addEvent(
      new PunchRegisteredEvent({
        userId: this._userId,
        workDayId: this._id,
        punchType: punch.punchType,
        punchedAt: punch.punchedAt,
        outsideStudio: punch.outsideStudio,
      }),
    );
  }

  recompute(): void {
    const expected = this._expectedMinutes ?? 0;
    const totals = calculateWorkDay(this._punches, expected);
    this._workedMinutes = totals.workedMinutes;
    this._breakMinutes = totals.breakMinutes;
    this._overtimeMinutes = totals.overtimeMinutes;
    this._hourBankDelta = totals.hourBankDelta;
  }

  close(now: Date = new Date()): void {
    if (
      this._status === DayStatus.CLOSED ||
      this._status === DayStatus.HOLIDAY ||
      this._status === DayStatus.MEDICAL_LEAVE
    ) {
      return;
    }

    const expected = this._expectedMinutes ?? 0;
    const totals = calculateWorkDay(this._punches, expected);
    this._workedMinutes = totals.workedMinutes;
    this._breakMinutes = totals.breakMinutes;
    this._overtimeMinutes = totals.overtimeMinutes;
    this._hourBankDelta = totals.hourBankDelta;
    this._status = totals.isComplete ? DayStatus.CLOSED : DayStatus.INCOMPLETE;
    this._closedAt = now;
    this.update();

    this.addEvent(
      new WorkDayClosedEvent({
        userId: this._userId,
        workDayId: this._id,
        status: this._status,
        workedMinutes: this._workedMinutes,
        hourBankDelta: this._hourBankDelta,
      }),
    );
  }

  reopen(): void {
    if (
      this._status !== DayStatus.CLOSED &&
      this._status !== DayStatus.INCOMPLETE
    ) {
      return;
    }
    this._status = DayStatus.OPEN;
    this._closedAt = undefined;
    this.update();
  }

  markHoliday(): void {
    this._status = DayStatus.HOLIDAY;
    this._expectedMinutes = 0;
    this._workedMinutes = 0;
    this._breakMinutes = 0;
    this._overtimeMinutes = 0;
    this._hourBankDelta = 0;
    this.update();
  }

  markMedicalLeave(medicalLeaveId: string): void {
    this._status = DayStatus.MEDICAL_LEAVE;
    this._medicalLeaveId = medicalLeaveId;
    this._expectedMinutes = 0;
    this._workedMinutes = 0;
    this._breakMinutes = 0;
    this._overtimeMinutes = 0;
    this._hourBankDelta = 0;
    this.update();
  }

  unmarkMedicalLeave(newExpectedMinutes: number): void {
    if (this._status !== DayStatus.MEDICAL_LEAVE) return;
    this._status = DayStatus.OPEN;
    this._medicalLeaveId = undefined;
    this._expectedMinutes = newExpectedMinutes;
    this._workedMinutes = undefined;
    this._breakMinutes = undefined;
    this._overtimeMinutes = undefined;
    this._hourBankDelta = undefined;
    this._closedAt = undefined;
    this.update();
  }

  validate(fields?: string[]): void {
    const validator = WorkDayValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  static create(props: WorkDayProps): WorkDay {
    const day = new WorkDay(props);
    day.validate();
    if (day.notification.hasErrors()) {
      throw new EntityValidationError(day.notification.toJSON());
    }
    return day;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      date: this._date,
      status: this._status,
      expectedMinutes: this._expectedMinutes,
      workedMinutes: this._workedMinutes,
      breakMinutes: this._breakMinutes,
      overtimeMinutes: this._overtimeMinutes,
      hourBankDelta: this._hourBankDelta,
      medicalLeaveId: this._medicalLeaveId,
      closedAt: this._closedAt,
      punches: this._punches.map((p) => p.toJSON()),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
