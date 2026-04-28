import { DomainEvent } from '@/modules/@shared/domain/events/domain-event.interface';

export interface MedicalLeaveRevokedEventPayload {
  medicalLeaveId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  revokedBy: string;
}

export class MedicalLeaveRevokedEvent implements DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventName = 'MedicalLeaveRevokedEvent';

  constructor(public readonly payload: MedicalLeaveRevokedEventPayload) {}
}
