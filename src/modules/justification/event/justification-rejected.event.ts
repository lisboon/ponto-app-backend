import { DomainEvent } from '@/modules/@shared/domain/events/domain-event.interface';

export interface JustificationRejectedEventPayload {
  justificationId: string;
  userId: string;
  workDayId: string;
  reviewedBy: string;
}

export class JustificationRejectedEvent implements DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'JustificationRejectedEvent';

  constructor(public readonly payload: JustificationRejectedEventPayload) {}
}
