import { WorkScheduleGateway } from '../../gateway/work-schedule.gateway';
import { WorkSchedule } from '../../domain/work-schedule.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  DeleteWorkScheduleUseCaseInputDto,
  DeleteWorkScheduleUseCaseInterface,
  DeleteWorkScheduleUseCaseOutputDto,
} from './delete.usecase.dto';

export default class DeleteWorkScheduleUseCase implements DeleteWorkScheduleUseCaseInterface {
  constructor(private readonly gateway: WorkScheduleGateway) {}

  async execute(
    data: DeleteWorkScheduleUseCaseInputDto,
  ): Promise<DeleteWorkScheduleUseCaseOutputDto> {
    const schedule = await this.gateway.findById(data.id);
    if (!schedule) {
      throw new NotFoundError(data.id, WorkSchedule);
    }

    schedule.delete();
    await this.gateway.update(schedule);

    return { id: schedule.id };
  }
}
