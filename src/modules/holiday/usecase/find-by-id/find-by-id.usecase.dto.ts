import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { Holiday } from '../../domain/holiday.entity';

export interface FindByIdHolidayUseCaseInputDto {
  id: string;
}

export interface FindByIdHolidayUseCaseInterface extends BaseUseCase<
  FindByIdHolidayUseCaseInputDto,
  Holiday
> {
  execute(data: FindByIdHolidayUseCaseInputDto): Promise<Holiday>;
}
