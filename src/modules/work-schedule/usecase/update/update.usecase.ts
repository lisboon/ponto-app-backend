import { WorkScheduleGateway } from '../../gateway/work-schedule.gateway';
import { WorkSchedule } from '../../domain/work-schedule.entity';
import { WeeklySchedule } from '../../domain/types/schedule-data.shape';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { WorkScheduleDto } from '../../facade/work-schedule.facade.dto';
import {
  UpdateWorkScheduleUseCaseInputDto,
  UpdateWorkScheduleUseCaseInterface,
} from './update.usecase.dto';

export default class UpdateWorkScheduleUseCase implements UpdateWorkScheduleUseCaseInterface {
  constructor(private readonly gateway: WorkScheduleGateway) {}

  async execute(
    data: UpdateWorkScheduleUseCaseInputDto,
  ): Promise<WorkScheduleDto> {
    const schedule = await this.gateway.findById(data.id);
    if (!schedule) {
      throw new NotFoundError(data.id, WorkSchedule);
    }

    schedule.updateSchedule({
      name: data.name,
      scheduleData: data.scheduleData as unknown as WeeklySchedule | undefined,
    });

    await this.gateway.update(schedule);

    return schedule.toJSON();
  }
}
