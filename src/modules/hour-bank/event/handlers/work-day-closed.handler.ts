import { EventHandlerInterface } from '@/modules/@shared/domain/events/event-handler.interface';
import { WorkDayClosedEvent } from '@/modules/time-clock/event/work-day-closed.event';
import ApplyDeltaUseCase from '../../usecase/apply-delta/apply-delta.usecase';

export class WorkDayClosedHandler implements EventHandlerInterface<WorkDayClosedEvent> {
  constructor(private readonly applyDeltaUseCase: ApplyDeltaUseCase) {}

  async handle(event: WorkDayClosedEvent): Promise<void> {
    const { userId, hourBankDelta } = event.payload;
    if (hourBankDelta === 0) return;
    await this.applyDeltaUseCase.execute({ userId, delta: hourBankDelta });
  }
}
