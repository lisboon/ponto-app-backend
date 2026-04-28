import { HolidayGateway } from '../../gateway/holiday.gateway';
import { Holiday } from '../../domain/holiday.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { HolidayDto } from '../../facade/holiday.facade.dto';
import {
  UpdateHolidayUseCaseInputDto,
  UpdateHolidayUseCaseInterface,
} from './update.usecase.dto';

export default class UpdateHolidayUseCase implements UpdateHolidayUseCaseInterface {
  constructor(private readonly gateway: HolidayGateway) {}

  async execute(data: UpdateHolidayUseCaseInputDto): Promise<HolidayDto> {
    const holiday = await this.gateway.findById(data.id);
    if (!holiday) {
      throw new NotFoundError(data.id, Holiday);
    }

    holiday.updateHoliday({
      name: data.name,
      date: data.date ? new Date(data.date) : undefined,
      type: data.type,
      description: data.description,
      isRecurring: data.isRecurring,
    });

    await this.gateway.update(holiday);

    return holiday.toJSON();
  }
}
