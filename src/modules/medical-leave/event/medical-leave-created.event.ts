import { DomainEvent } from '@/modules/@shared/domain/events/domain-event.interface';

export interface MedicalLeaveCreatedEventPayload {
  medicalLeaveId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  daysAffected: number;
}

export class MedicalLeaveCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'MedicalLeaveCreatedEvent';

  constructor(public readonly payload: MedicalLeaveCreatedEventPayload) {}
}
