import { HolidayGateway } from '../../gateway/holiday.gateway';
import { Holiday } from '../../domain/holiday.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  DeleteHolidayUseCaseInputDto,
  DeleteHolidayUseCaseInterface,
  DeleteHolidayUseCaseOutputDto,
} from './delete.usecase.dto';

export default class DeleteHolidayUseCase implements DeleteHolidayUseCaseInterface {
  constructor(private readonly gateway: HolidayGateway) {}

  async execute(
    data: DeleteHolidayUseCaseInputDto,
  ): Promise<DeleteHolidayUseCaseOutputDto> {
    const holiday = await this.gateway.findById(data.id);
    if (!holiday) {
      throw new NotFoundError(data.id, Holiday);
    }

    holiday.delete();
    await this.gateway.update(holiday);

    return { id: holiday.id };
  }
}
