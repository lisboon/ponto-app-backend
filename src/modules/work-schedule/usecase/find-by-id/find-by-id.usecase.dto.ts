import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { WorkSchedule } from '../../domain/work-schedule.entity';

export interface FindByIdWorkScheduleUseCaseInputDto {
  id: string;
}

export interface FindByIdWorkScheduleUseCaseInterface extends BaseUseCase<
  FindByIdWorkScheduleUseCaseInputDto,
  WorkSchedule
> {
  execute(data: FindByIdWorkScheduleUseCaseInputDto): Promise<WorkSchedule>;
}
