import { EventHandlerInterface } from '@/modules/@shared/domain/events/event-handler.interface';
import { JustificationApprovedEvent } from '../justification-approved.event';
import RecalculateDayUseCase from '@/modules/time-clock/usecase/recalculate-day/recalculate-day.usecase';
import { TimeClockGateway } from '@/modules/time-clock/gateway/time-clock.gateway';

export class JustificationApprovedHandler implements EventHandlerInterface<JustificationApprovedEvent> {
  constructor(
    private readonly timeClockGateway: TimeClockGateway,
    private readonly recalculateUseCase: RecalculateDayUseCase,
  ) {}

  async handle(event: JustificationApprovedEvent): Promise<void> {
    const { userId, workDayId } = event.payload;
    const day = await this.timeClockGateway.findDayById(workDayId);
    if (!day) return;

    await this.recalculateUseCase.execute({
      userId,
      date: day.date.toISOString().substring(0, 10),
    });
  }
}
