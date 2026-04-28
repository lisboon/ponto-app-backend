import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { PunchType } from '@/modules/@shared/domain/enums';
import TimeEntryValidatorFactory from './validators/time-entry.validator';

export interface TimeEntryProps {
  id?: string;
  workDayId: string;
  punchType: PunchType;
  punchedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  outsideStudio?: boolean;
  isManual?: boolean;
  manualNote?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class TimeEntry extends BaseEntity {
  private _workDayId: string;
  private _punchType: PunchType;
  private _punchedAt: Date;
  private _ipAddress?: string;
  private _userAgent?: string;
  private _outsideStudio: boolean;
  private _isManual: boolean;
  private _manualNote?: string;

  constructor(props: TimeEntryProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._workDayId = props.workDayId;
    this._punchType = props.punchType;
    this._punchedAt = props.punchedAt;
    this._ipAddress = props.ipAddress;
    this._userAgent = props.userAgent;
    this._outsideStudio = props.outsideStudio ?? false;
    this._isManual = props.isManual ?? false;
    this._manualNote = props.manualNote;
  }

  get workDayId(): string {
    return this._workDayId;
  }
  get punchType(): PunchType {
    return this._punchType;
  }
  get punchedAt(): Date {
    return this._punchedAt;
  }
  get ipAddress(): string | undefined {
    return this._ipAddress;
  }
  get userAgent(): string | undefined {
    return this._userAgent;
  }
  get outsideStudio(): boolean {
    return this._outsideStudio;
  }
  get isManual(): boolean {
    return this._isManual;
  }
  get manualNote(): string | undefined {
    return this._manualNote;
  }

  validate(fields?: string[]): void {
    const validator = TimeEntryValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  static create(props: TimeEntryProps): TimeEntry {
    const entry = new TimeEntry(props);
    entry.validate();
    if (entry.notification.hasErrors()) {
      throw new EntityValidationError(entry.notification.toJSON());
    }
    return entry;
  }

  toJSON() {
    return {
      id: this._id,
      workDayId: this._workDayId,
      punchType: this._punchType,
      punchedAt: this._punchedAt,
      ipAddress: this._ipAddress,
      userAgent: this._userAgent,
      outsideStudio: this._outsideStudio,
      isManual: this._isManual,
      manualNote: this._manualNote,
      createdAt: this._createdAt,
    };
  }
}
