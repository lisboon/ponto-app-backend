import { DomainEvent } from '@/modules/@shared/domain/events/domain-event.interface';

export interface AnnouncementPublishedEventPayload {
  announcementId: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date;
}

export class AnnouncementPublishedEvent implements DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'AnnouncementPublishedEvent';

  constructor(public readonly payload: AnnouncementPublishedEventPayload) {}
}
