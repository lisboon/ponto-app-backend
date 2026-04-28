import { HourBankGateway } from '../../gateway/hour-bank.gateway';
import { HourBankDto } from '../../facade/hour-bank.facade.dto';
import {
  FindByUserUseCaseInputDto,
  FindByUserUseCaseInterface,
  FindByUserUseCaseOutputDto,
} from './find-by-user.usecase.dto';

export default class FindByUserUseCase implements FindByUserUseCaseInterface {
  constructor(private readonly gateway: HourBankGateway) {}

  async execute(
    data: FindByUserUseCaseInputDto,
  ): Promise<FindByUserUseCaseOutputDto> {
    const hb = await this.gateway.findByUserId(data.userId);
    return hb ? (hb.toJSON() as HourBankDto) : null;
  }
}
