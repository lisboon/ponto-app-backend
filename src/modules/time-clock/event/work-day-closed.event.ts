import { DomainEvent } from '@/modules/@shared/domain/events/domain-event.interface';
import { DayStatus } from '@/modules/@shared/domain/enums';

export interface WorkDayClosedEventPayload {
  userId: string;
  workDayId: string;
  status: DayStatus;
  workedMinutes: number;
  hourBankDelta: number;
}

export class WorkDayClosedEvent implements DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'WorkDayClosedEvent';

  constructor(public readonly payload: WorkDayClosedEventPayload) {}
}
