import { Type } from 'class-transformer';
import { IsObject, IsOptional, Length, ValidateNested } from 'class-validator';
import { WeeklyScheduleInputDto } from '@/modules/work-schedule/usecase/create/create.usecase.dto';

export class UpdateWorkScheduleBodyDto {
  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres' })
  @IsOptional()
  name?: string;

  @IsObject({ message: 'scheduleData deve ser um objeto' })
  @ValidateNested()
  @Type(() => WeeklyScheduleInputDto)
  @IsOptional()
  scheduleData?: WeeklyScheduleInputDto;
}
