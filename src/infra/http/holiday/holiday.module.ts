import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import HolidayFacade from '@/modules/holiday/facade/holiday.facade';
import HolidayFacadeFactory from '@/modules/holiday/factory/facade.factory';

@Module({
  imports: [AuthModule],
  controllers: [HolidayController],
  providers: [
    HolidayService,
    {
      provide: HolidayFacade,
      useFactory: () => HolidayFacadeFactory.create(),
    },
  ],
  exports: [HolidayService, HolidayFacade],
})
export class HolidayModule {}
