import { HourBankGateway } from '../../gateway/hour-bank.gateway';
import { HourBank } from '../../domain/hour-bank.entity';
import { HourBankDto } from '../../facade/hour-bank.facade.dto';
import {
  RecalculateByUserUseCaseInputDto,
  RecalculateByUserUseCaseInterface,
  RecalculateByUserUseCaseOutputDto,
} from './recalculate-by-user.usecase.dto';

export default class RecalculateByUserUseCase implements RecalculateByUserUseCaseInterface {
  constructor(private readonly gateway: HourBankGateway) {}

  async execute(
    data: RecalculateByUserUseCaseInputDto,
  ): Promise<RecalculateByUserUseCaseOutputDto> {
    const total = await this.gateway.sumClosedDeltaForUser(data.userId);

    let hb = await this.gateway.findByUserId(data.userId);
    if (!hb) {
      hb = HourBank.create(data.userId);
    }

    hb.setBalance(total);
    await this.gateway.upsert(hb);

    return hb.toJSON() as HourBankDto;
  }
}
