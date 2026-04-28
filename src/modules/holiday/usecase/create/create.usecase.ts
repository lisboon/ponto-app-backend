import { HolidayGateway } from '../../gateway/holiday.gateway';
import { Holiday } from '../../domain/holiday.entity';
import { HolidayDto } from '../../facade/holiday.facade.dto';
import {
  CreateHolidayUseCaseInputDto,
  CreateHolidayUseCaseInterface,
} from './create.usecase.dto';

export default class CreateHolidayUseCase implements CreateHolidayUseCaseInterface {
  constructor(private readonly gateway: HolidayGateway) {}

  async execute(data: CreateHolidayUseCaseInputDto): Promise<HolidayDto> {
    const holiday = Holiday.create({
      name: data.name,
      date: new Date(data.date),
      type: data.type,
      description: data.description,
      isRecurring: data.isRecurring ?? false,
    });

    await this.gateway.create(holiday);

    return holiday.toJSON();
  }
}
