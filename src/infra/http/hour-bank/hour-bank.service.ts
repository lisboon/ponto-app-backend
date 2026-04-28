import { Inject, Injectable } from '@nestjs/common';
import HourBankFacade from '@/modules/hour-bank/facade/hour-bank.facade';

@Injectable()
export class HourBankService {
  @Inject(HourBankFacade)
  private readonly facade: HourBankFacade;

  findByUser(userId: string) {
    return this.facade.findByUser({ userId });
  }

  recalculate(userId: string) {
    return this.facade.recalculate({ userId });
  }
}
