import { TimeClockGateway } from '../../gateway/time-clock.gateway';
import { WorkDay } from '../../domain/work-day.entity';
import { UserGateway } from '@/modules/user/gateway/user.gateway';
import { WorkScheduleGateway } from '@/modules/work-schedule/gateway/work-schedule.gateway';
import { HolidayGateway } from '@/modules/holiday/gateway/holiday.gateway';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { resolveExpectedMinutes } from '../_shared/resolve-expected-minutes';
import { dayKey } from '../_shared/get-or-create-day';
import { WorkDayDto } from '../../facade/time-clock.facade.dto';
import {
  RecalculateDayUseCaseInputDto,
  RecalculateDayUseCaseInterface,
} from './recalculate-day.usecase.dto';

export default class RecalculateDayUseCase implements RecalculateDayUseCaseInterface {
  constructor(
    private readonly gateway: TimeClockGateway,
    private readonly userGateway: UserGateway,
    private readonly workScheduleGateway: WorkScheduleGateway,
    private readonly holidayGateway: HolidayGateway,
  ) {}

  async execute(data: RecalculateDayUseCaseInputDto): Promise<WorkDayDto> {
    const date = dayKey(new Date(data.date));
    const day = await this.gateway.findDay(data.userId, date);
    if (!day) {
      throw new NotFoundError(`${data.userId}@${data.date}`, WorkDay);
    }

    const { expectedMinutes } = await resolveExpectedMinutes(
      data.userId,
      date,
      this.userGateway,
      this.workScheduleGateway,
      this.holidayGateway,
    );

    const updated = new WorkDay({
      id: day.id,
      userId: day.userId,
      date: day.date,
      status: day.status,
      expectedMinutes,
      medicalLeaveId: day.medicalLeaveId,
      closedAt: day.closedAt,
      punches: [...day.punches],
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    });
    updated.recompute();
    updated.update();

    await this.gateway.saveDay(updated);
    return updated.toJSON() as WorkDayDto;
  }
}
