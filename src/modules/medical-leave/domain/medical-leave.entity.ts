import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import MedicalLeaveValidatorFactory from './validators/medical-leave.validator';
import { eachDay } from './services/date-range.service';
import { MedicalLeaveCreatedEvent } from '../event/medical-leave-created.event';
import { MedicalLeaveRevokedEvent } from '../event/medical-leave-revoked.event';

export interface MedicalLeaveProps {
  id?: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  attachmentUrl: string;
  reason?: string;
  createdBy: string;
  revokedAt?: Date;
  revokedBy?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class MedicalLeave extends BaseEntity {
  private _userId: string;
  private _startDate: Date;
  private _endDate: Date;
  private _attachmentUrl: string;
  private _reason?: string;
  private _createdBy: string;
  private _revokedAt?: Date;
  private _revokedBy?: string;

  constructor(props: MedicalLeaveProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._userId = props.userId;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._attachmentUrl = props.attachmentUrl;
    this._reason = props.reason;
    this._createdBy = props.createdBy;
    this._revokedAt = props.revokedAt;
    this._revokedBy = props.revokedBy;
  }

  get userId(): string {
    return this._userId;
  }
  get startDate(): Date {
    return this._startDate;
  }
  get endDate(): Date {
    return this._endDate;
  }
  get attachmentUrl(): string {
    return this._attachmentUrl;
  }
  get reason(): string | undefined {
    return this._reason;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get revokedAt(): Date | undefined {
    return this._revokedAt;
  }
  get revokedBy(): string | undefined {
    return this._revokedBy;
  }

  get isRevoked(): boolean {
    return this._revokedAt !== undefined;
  }

  affectedDays(): Date[] {
    return eachDay(this._startDate, this._endDate);
  }

  emitCreatedEvent(): void {
    this.addEvent(
      new MedicalLeaveCreatedEvent({
        medicalLeaveId: this.id,
        userId: this._userId,
        startDate: this._startDate,
        endDate: this._endDate,
        daysAffected: this.affectedDays().length,
      }),
    );
  }

  revoke(revokedBy: string) {
    if (this.isRevoked) {
      throw new EntityValidationError([
        { field: 'revokedAt', message: 'Atestado já foi revogado' },
      ]);
    }
    this._revokedAt = new Date();
    this._revokedBy = revokedBy;
    this.update();
    this.addEvent(
      new MedicalLeaveRevokedEvent({
        medicalLeaveId: this.id,
        userId: this._userId,
        startDate: this._startDate,
        endDate: this._endDate,
        revokedBy,
      }),
    );
  }

  validate(fields?: string[]): void {
    const validator = MedicalLeaveValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  static create(props: MedicalLeaveProps): MedicalLeave {
    const ml = new MedicalLeave(props);
    ml.validate();
    if (ml.notification.hasErrors()) {
      throw new EntityValidationError(ml.notification.toJSON());
    }
    return ml;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      startDate: this._startDate,
      endDate: this._endDate,
      attachmentUrl: this._attachmentUrl,
      reason: this._reason,
      createdBy: this._createdBy,
      revokedAt: this._revokedAt,
      revokedBy: this._revokedBy,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
