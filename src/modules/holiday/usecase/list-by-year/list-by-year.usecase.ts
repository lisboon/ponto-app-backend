import { HolidayGateway } from '../../gateway/holiday.gateway';
import {
  ListByYearHolidayUseCaseInputDto,
  ListByYearHolidayUseCaseInterface,
  ListByYearHolidayUseCaseOutputDto,
} from './list-by-year.usecase.dto';

export default class ListByYearHolidayUseCase implements ListByYearHolidayUseCaseInterface {
  constructor(private readonly gateway: HolidayGateway) {}

  async execute(
    data: ListByYearHolidayUseCaseInputDto,
  ): Promise<ListByYearHolidayUseCaseOutputDto> {
    const holidays = await this.gateway.listByYear(data.year);
    return {
      year: data.year,
      items: holidays.map((h) => h.toJSON()),
    };
  }
}
