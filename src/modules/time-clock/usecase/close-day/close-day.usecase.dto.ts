import { IsDateString, IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { WorkDayDto } from '../../facade/time-clock.facade.dto';

export class CloseDayUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsDateString({}, { message: 'date inválida (esperado ISO yyyy-mm-dd)' })
  date: string;
}

export type CloseDayUseCaseOutputDto = WorkDayDto;

export interface CloseDayUseCaseInterface extends BaseUseCase<
  CloseDayUseCaseInputDto,
  CloseDayUseCaseOutputDto
> {
  execute(data: CloseDayUseCaseInputDto): Promise<CloseDayUseCaseOutputDto>;
}
