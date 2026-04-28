import { HourBankGateway } from '../../gateway/hour-bank.gateway';
import { HourBank } from '../../domain/hour-bank.entity';
import {
  ApplyDeltaUseCaseInputDto,
  ApplyDeltaUseCaseInterface,
  ApplyDeltaUseCaseOutputDto,
} from './apply-delta.usecase.dto';

export default class ApplyDeltaUseCase implements ApplyDeltaUseCaseInterface {
  constructor(private readonly gateway: HourBankGateway) {}

  async execute(
    data: ApplyDeltaUseCaseInputDto,
  ): Promise<ApplyDeltaUseCaseOutputDto> {
    let hb = await this.gateway.findByUserId(data.userId);
    if (!hb) {
      hb = HourBank.create(data.userId);
    }

    hb.applyDelta(data.delta);
    await this.gateway.upsert(hb);

    return hb.toJSON() as ApplyDeltaUseCaseOutputDto;
  }
}
