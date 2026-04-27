import { Type } from 'class-transformer';
import { IsObject, IsOptional, Length, ValidateNested } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { WeeklyScheduleInputDto } from '../create/create.usecase.dto';
import { WorkScheduleDto } from '../../facade/work-schedule.facade.dto';

export class UpdateWorkScheduleUseCaseInputDto {
  id: string;

  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres' })
  @IsOptional()
  name?: string;

  @IsObject({ message: 'scheduleData deve ser um objeto' })
  @ValidateNested()
  @Type(() => WeeklyScheduleInputDto)
  @IsOptional()
  scheduleData?: WeeklyScheduleInputDto;
}

export type UpdateWorkScheduleUseCaseOutputDto = WorkScheduleDto;

export interface UpdateWorkScheduleUseCaseInterface extends BaseUseCase<
  UpdateWorkScheduleUseCaseInputDto,
  UpdateWorkScheduleUseCaseOutputDto
> {
  execute(
    data: UpdateWorkScheduleUseCaseInputDto,
  ): Promise<UpdateWorkScheduleUseCaseOutputDto>;
}
