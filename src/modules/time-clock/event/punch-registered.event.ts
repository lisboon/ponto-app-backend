import { DomainEvent } from '@/modules/@shared/domain/events/domain-event.interface';
import { PunchType } from '@/modules/@shared/domain/enums';

export interface PunchRegisteredEventPayload {
  userId: string;
  workDayId: string;
  punchType: PunchType;
  punchedAt: Date;
  outsideStudio: boolean;
}

export class PunchRegisteredEvent implements DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'PunchRegisteredEvent';

  constructor(public readonly payload: PunchRegisteredEventPayload) {}
}
