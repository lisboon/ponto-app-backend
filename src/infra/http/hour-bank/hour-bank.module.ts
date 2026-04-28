import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HourBankController } from './hour-bank.controller';
import { HourBankService } from './hour-bank.service';
import HourBankFacade from '@/modules/hour-bank/facade/hour-bank.facade';
import HourBankFacadeFactory from '@/modules/hour-bank/factory/facade.factory';

@Module({
  imports: [AuthModule],
  controllers: [HourBankController],
  providers: [
    HourBankService,
    {
      provide: HourBankFacade,
      useFactory: () => HourBankFacadeFactory.create(),
    },
  ],
  exports: [HourBankService, HourBankFacade],
})
export class HourBankModule {}
