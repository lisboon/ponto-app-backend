import { DomainEvent } from '@/modules/@shared/domain/events/domain-event.interface';

export interface JustificationApprovedEventPayload {
  justificationId: string;
  userId: string;
  workDayId: string;
  reviewedBy: string;
}

export class JustificationApprovedEvent implements DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'JustificationApprovedEvent';

  constructor(public readonly payload: JustificationApprovedEventPayload) {}
}
