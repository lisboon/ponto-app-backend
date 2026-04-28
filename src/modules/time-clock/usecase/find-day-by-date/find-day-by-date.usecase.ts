import { TimeClockGateway } from '../../gateway/time-clock.gateway';
import { dayKey } from '../_shared/get-or-create-day';
import { WorkDayDto } from '../../facade/time-clock.facade.dto';
import {
  FindDayByDateUseCaseInputDto,
  FindDayByDateUseCaseInterface,
} from './find-day-by-date.usecase.dto';

export default class FindDayByDateUseCase implements FindDayByDateUseCaseInterface {
  constructor(private readonly gateway: TimeClockGateway) {}

  async execute(
    data: FindDayByDateUseCaseInputDto,
  ): Promise<WorkDayDto | null> {
    const day = await this.gateway.findDay(
      data.userId,
      dayKey(new Date(data.date)),
    );
    return day ? (day.toJSON() as WorkDayDto) : null;
  }
}
