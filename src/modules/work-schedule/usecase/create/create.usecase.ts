import { WorkScheduleGateway } from '../../gateway/work-schedule.gateway';
import { WorkSchedule } from '../../domain/work-schedule.entity';
import { WeeklySchedule } from '../../domain/types/schedule-data.shape';
import { WorkScheduleDto } from '../../facade/work-schedule.facade.dto';
import {
  CreateWorkScheduleUseCaseInputDto,
  CreateWorkScheduleUseCaseInterface,
} from './create.usecase.dto';

export default class CreateWorkScheduleUseCase implements CreateWorkScheduleUseCaseInterface {
  constructor(private readonly gateway: WorkScheduleGateway) {}

  async execute(
    data: CreateWorkScheduleUseCaseInputDto,
  ): Promise<WorkScheduleDto> {
    const schedule = WorkSchedule.create({
      name: data.name,
      scheduleData: data.scheduleData as unknown as WeeklySchedule,
    });

    await this.gateway.create(schedule);

    return schedule.toJSON();
  }
}
