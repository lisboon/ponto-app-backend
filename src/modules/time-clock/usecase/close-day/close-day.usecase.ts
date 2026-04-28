import { TimeClockGateway } from '../../gateway/time-clock.gateway';
import { WorkDay } from '../../domain/work-day.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { EventDispatcherInterface } from '@/modules/@shared/domain/events/event-dispatcher.interface';
import { dayKey } from '../_shared/get-or-create-day';
import { WorkDayDto } from '../../facade/time-clock.facade.dto';
import {
  CloseDayUseCaseInputDto,
  CloseDayUseCaseInterface,
} from './close-day.usecase.dto';

export default class CloseDayUseCase implements CloseDayUseCaseInterface {
  constructor(
    private readonly gateway: TimeClockGateway,
    private readonly eventDispatcher: EventDispatcherInterface,
  ) {}

  async execute(data: CloseDayUseCaseInputDto): Promise<WorkDayDto> {
    const date = dayKey(new Date(data.date));
    const day = await this.gateway.findDay(data.userId, date);
    if (!day) {
      throw new NotFoundError(`${data.userId}@${data.date}`, WorkDay);
    }

    day.close(new Date());
    await this.gateway.saveDay(day);

    for (const event of day.pullEvents()) {
      await this.eventDispatcher.dispatch(event);
    }

    return day.toJSON() as WorkDayDto;
  }
}
