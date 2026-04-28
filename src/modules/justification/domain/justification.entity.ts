import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { JustificationStatus } from '@/modules/@shared/domain/enums';
import JustificationValidatorFactory from './validators/justification.validator';
import { JustificationApprovedEvent } from '../event/justification-approved.event';
import { JustificationRejectedEvent } from '../event/justification-rejected.event';

export interface JustificationProps {
  id?: string;
  userId: string;
  workDayId: string;
  createdBy: string;
  description: string;
  attachmentUrl?: string;
  status?: JustificationStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNote?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Justification extends BaseEntity {
  private _userId: string;
  private _workDayId: string;
  private _createdBy: string;
  private _description: string;
  private _attachmentUrl?: string;
  private _status: JustificationStatus;
  private _reviewedBy?: string;
  private _reviewedAt?: Date;
  private _reviewNote?: string;

  constructor(props: JustificationProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._userId = props.userId;
    this._workDayId = props.workDayId;
    this._createdBy = props.createdBy;
    this._description = props.description;
    this._attachmentUrl = props.attachmentUrl;
    this._status = props.status ?? JustificationStatus.PENDING;
    this._reviewedBy = props.reviewedBy;
    this._reviewedAt = props.reviewedAt;
    this._reviewNote = props.reviewNote;
  }

  get userId(): string {
    return this._userId;
  }
  get workDayId(): string {
    return this._workDayId;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get description(): string {
    return this._description;
  }
  get attachmentUrl(): string | undefined {
    return this._attachmentUrl;
  }
  get status(): JustificationStatus {
    return this._status;
  }
  get reviewedBy(): string | undefined {
    return this._reviewedBy;
  }
  get reviewedAt(): Date | undefined {
    return this._reviewedAt;
  }
  get reviewNote(): string | undefined {
    return this._reviewNote;
  }

  /**
   * Edição prévia à revisão. Após `approve`/`reject`, o registro é imutável
   * (re-revisão é tech debt — RH abre uma nova justificação se quiser corrigir).
   */
  updateContent(props: { description?: string; attachmentUrl?: string }) {
    if (this._status !== JustificationStatus.PENDING) {
      throw new EntityValidationError([
        {
          field: 'status',
          message: 'Justificação já revisada não pode ser editada',
        },
      ]);
    }
    if (props.description !== undefined) this._description = props.description;
    if (props.attachmentUrl !== undefined)
      this._attachmentUrl = props.attachmentUrl;

    this.update();
    this.validate(['update']);
    if (this.notification.hasErrors()) {
      throw new EntityValidationError(this.notification.toJSON());
    }
  }

  approve(reviewerId: string, note?: string) {
    if (this._status !== JustificationStatus.PENDING) {
      throw new EntityValidationError([
        {
          field: 'status',
          message: 'Justificação já revisada',
        },
      ]);
    }
    this._status = JustificationStatus.APPROVED;
    this._reviewedBy = reviewerId;
    this._reviewedAt = new Date();
    this._reviewNote = note;
    this.update();
    this.addEvent(
      new JustificationApprovedEvent({
        justificationId: this.id,
        userId: this._userId,
        workDayId: this._workDayId,
        reviewedBy: reviewerId,
      }),
    );
  }

  reject(reviewerId: string, note: string) {
    if (this._status !== JustificationStatus.PENDING) {
      throw new EntityValidationError([
        {
          field: 'status',
          message: 'Justificação já revisada',
        },
      ]);
    }
    if (!note || note.trim().length === 0) {
      throw new EntityValidationError([
        {
          field: 'reviewNote',
          message: 'A nota de revisão é obrigatória ao rejeitar',
        },
      ]);
    }
    this._status = JustificationStatus.REJECTED;
    this._reviewedBy = reviewerId;
    this._reviewedAt = new Date();
    this._reviewNote = note;
    this.update();
    this.addEvent(
      new JustificationRejectedEvent({
        justificationId: this.id,
        userId: this._userId,
        workDayId: this._workDayId,
        reviewedBy: reviewerId,
      }),
    );
  }

  validate(fields?: string[]): void {
    const validator = JustificationValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  static create(props: JustificationProps): Justification {
    const j = new Justification(props);
    j.validate();
    if (j.notification.hasErrors()) {
      throw new EntityValidationError(j.notification.toJSON());
    }
    return j;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      workDayId: this._workDayId,
      createdBy: this._createdBy,
      description: this._description,
      attachmentUrl: this._attachmentUrl,
      status: this._status,
      reviewedBy: this._reviewedBy,
      reviewedAt: this._reviewedAt,
      reviewNote: this._reviewNote,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
