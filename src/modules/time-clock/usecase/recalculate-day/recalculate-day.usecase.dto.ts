import { IsDateString, IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { WorkDayDto } from '../../facade/time-clock.facade.dto';

export class RecalculateDayUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsDateString({}, { message: 'date inválida (esperado ISO yyyy-mm-dd)' })
  date: string;
}

export type RecalculateDayUseCaseOutputDto = WorkDayDto;

export interface RecalculateDayUseCaseInterface extends BaseUseCase<
  RecalculateDayUseCaseInputDto,
  RecalculateDayUseCaseOutputDto
> {
  execute(
    data: RecalculateDayUseCaseInputDto,
  ): Promise<RecalculateDayUseCaseOutputDto>;
}
