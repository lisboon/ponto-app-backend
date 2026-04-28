import { Inject, Injectable } from '@nestjs/common';
import HolidayFacade from '@/modules/holiday/facade/holiday.facade';
import {
  CreateHolidayFacadeInputDto,
  DeleteHolidayFacadeInputDto,
  FindByIdHolidayFacadeInputDto,
  ListByYearHolidayFacadeInputDto,
  UpdateHolidayFacadeInputDto,
} from '@/modules/holiday/facade/holiday.facade.dto';

@Injectable()
export class HolidayService {
  @Inject(HolidayFacade)
  private readonly facade: HolidayFacade;

  create(input: CreateHolidayFacadeInputDto) {
    return this.facade.create(input);
  }

  findById(input: FindByIdHolidayFacadeInputDto) {
    return this.facade.findById(input);
  }

  update(input: UpdateHolidayFacadeInputDto) {
    return this.facade.update(input);
  }

  delete(input: DeleteHolidayFacadeInputDto) {
    return this.facade.delete(input);
  }

  listByYear(input: ListByYearHolidayFacadeInputDto) {
    return this.facade.listByYear(input);
  }
}
