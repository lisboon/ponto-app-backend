import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { AnnouncementStatus } from '@/modules/@shared/domain/enums';
import AnnouncementValidatorFactory from './validators/announcement.validator';
import { AnnouncementPublishedEvent } from '../event/announcement-published.event';

export interface AnnouncementProps {
  id?: string;
  authorId: string;
  title: string;
  content: string;
  status?: AnnouncementStatus;
  publishedAt?: Date;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Announcement extends BaseEntity {
  private _authorId: string;
  private _title: string;
  private _content: string;
  private _status: AnnouncementStatus;
  private _publishedAt?: Date;

  constructor(props: AnnouncementProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._authorId = props.authorId;
    this._title = props.title;
    this._content = props.content;
    this._status = props.status ?? AnnouncementStatus.DRAFT;
    this._publishedAt = props.publishedAt;
    this.validate();
  }

  static create(props: Omit<AnnouncementProps, 'id' | 'status'>): Announcement {
    return new Announcement({ ...props, status: AnnouncementStatus.DRAFT });
  }

  private validate(fields?: string[]): void {
    const factory = AnnouncementValidatorFactory.create();
    factory.validate(this._notification, this, fields ?? ['create']);
    if (this._notification.hasErrors()) {
      throw new EntityValidationError(this._notification.toJSON());
    }
  }

  get authorId(): string {
    return this._authorId;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get status(): AnnouncementStatus {
    return this._status;
  }

  get publishedAt(): Date | undefined {
    return this._publishedAt;
  }

  publish(): void {
    if (this._status !== AnnouncementStatus.DRAFT) {
      throw new Error('Somente rascunhos podem ser publicados');
    }
    this._status = AnnouncementStatus.PUBLISHED;
    this._publishedAt = new Date();
    this.update();
    this.addEvent(
      new AnnouncementPublishedEvent({
        announcementId: this._id,
        title: this._title,
        content: this._content,
        authorId: this._authorId,
        publishedAt: this._publishedAt,
      }),
    );
  }

  archive(): void {
    if (this._status === AnnouncementStatus.ARCHIVED) return;
    this._status = AnnouncementStatus.ARCHIVED;
    this.update();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      authorId: this._authorId,
      title: this._title,
      content: this._content,
      status: this._status,
      publishedAt: this._publishedAt,
    };
  }
}
