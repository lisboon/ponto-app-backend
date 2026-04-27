import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  Length,
  Matches,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { TIME_REGEX } from '../../domain/types/schedule-data.shape';
import { WorkScheduleDto } from '../../facade/work-schedule.facade.dto';

export class DayScheduleInputDto {
  @Matches(TIME_REGEX, { message: 'Horário inicial inválido (HH:MM)' })
  start: string;

  @Matches(TIME_REGEX, { message: 'Horário final inválido (HH:MM)' })
  end: string;

  @IsInt({ message: 'breakMinutes deve ser inteiro' })
  @Min(0, { message: 'breakMinutes não pode ser negativo' })
  breakMinutes: number;
}

export class WeeklyScheduleInputDto {
  @ValidateIf((o: WeeklyScheduleInputDto) => o.sunday !== null)
  @ValidateNested()
  @Type(() => DayScheduleInputDto)
  sunday: DayScheduleInputDto | null;

  @ValidateIf((o: WeeklyScheduleInputDto) => o.monday !== null)
  @ValidateNested()
  @Type(() => DayScheduleInputDto)
  monday: DayScheduleInputDto | null;

  @ValidateIf((o: WeeklyScheduleInputDto) => o.tuesday !== null)
  @ValidateNested()
  @Type(() => DayScheduleInputDto)
  tuesday: DayScheduleInputDto | null;

  @ValidateIf((o: WeeklyScheduleInputDto) => o.wednesday !== null)
  @ValidateNested()
  @Type(() => DayScheduleInputDto)
  wednesday: DayScheduleInputDto | null;

  @ValidateIf((o: WeeklyScheduleInputDto) => o.thursday !== null)
  @ValidateNested()
  @Type(() => DayScheduleInputDto)
  thursday: DayScheduleInputDto | null;

  @ValidateIf((o: WeeklyScheduleInputDto) => o.friday !== null)
  @ValidateNested()
  @Type(() => DayScheduleInputDto)
  friday: DayScheduleInputDto | null;

  @ValidateIf((o: WeeklyScheduleInputDto) => o.saturday !== null)
  @ValidateNested()
  @Type(() => DayScheduleInputDto)
  saturday: DayScheduleInputDto | null;
}

export class CreateWorkScheduleUseCaseInputDto {
  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @IsObject({ message: 'scheduleData deve ser um objeto' })
  @ValidateNested()
  @Type(() => WeeklyScheduleInputDto)
  scheduleData: WeeklyScheduleInputDto;
}

export type CreateWorkScheduleUseCaseOutputDto = WorkScheduleDto;

export interface CreateWorkScheduleUseCaseInterface extends BaseUseCase<
  CreateWorkScheduleUseCaseInputDto,
  CreateWorkScheduleUseCaseOutputDto
> {
  execute(
    data: CreateWorkScheduleUseCaseInputDto,
  ): Promise<CreateWorkScheduleUseCaseOutputDto>;
}
