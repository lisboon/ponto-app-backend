import { WorkScheduleGateway } from '../../gateway/work-schedule.gateway';
import { WorkSchedule } from '../../domain/work-schedule.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  FindByIdWorkScheduleUseCaseInputDto,
  FindByIdWorkScheduleUseCaseInterface,
} from './find-by-id.usecase.dto';

export default class FindByIdWorkScheduleUseCase implements FindByIdWorkScheduleUseCaseInterface {
  constructor(private readonly gateway: WorkScheduleGateway) {}

  async execute(
    data: FindByIdWorkScheduleUseCaseInputDto,
  ): Promise<WorkSchedule> {
    const schedule = await this.gateway.findById(data.id);
    if (!schedule) {
      throw new NotFoundError(data.id, WorkSchedule);
    }
    return schedule;
  }
}
