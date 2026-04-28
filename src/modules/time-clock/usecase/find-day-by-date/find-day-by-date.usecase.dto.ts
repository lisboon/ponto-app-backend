import { IsDateString, IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { WorkDayDto } from '../../facade/time-clock.facade.dto';

export class FindDayByDateUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsDateString({}, { message: 'date inválida (esperado ISO yyyy-mm-dd)' })
  date: string;
}

export type FindDayByDateUseCaseOutputDto = WorkDayDto | null;

export interface FindDayByDateUseCaseInterface extends BaseUseCase<
  FindDayByDateUseCaseInputDto,
  FindDayByDateUseCaseOutputDto
> {
  execute(
    data: FindDayByDateUseCaseInputDto,
  ): Promise<FindDayByDateUseCaseOutputDto>;
}
