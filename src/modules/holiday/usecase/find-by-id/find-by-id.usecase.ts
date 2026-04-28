import { HolidayGateway } from '../../gateway/holiday.gateway';
import { Holiday } from '../../domain/holiday.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  FindByIdHolidayUseCaseInputDto,
  FindByIdHolidayUseCaseInterface,
} from './find-by-id.usecase.dto';

export default class FindByIdHolidayUseCase implements FindByIdHolidayUseCaseInterface {
  constructor(private readonly gateway: HolidayGateway) {}

  async execute(data: FindByIdHolidayUseCaseInputDto): Promise<Holiday> {
    const holiday = await this.gateway.findById(data.id);
    if (!holiday) {
      throw new NotFoundError(data.id, Holiday);
    }
    return holiday;
  }
}
