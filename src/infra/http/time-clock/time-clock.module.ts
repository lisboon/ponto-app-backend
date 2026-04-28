import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TimeClockController } from './time-clock.controller';
import { TimeClockService } from './time-clock.service';
import TimeClockFacade from '@/modules/time-clock/facade/time-clock.facade';
import TimeClockFacadeFactory from '@/modules/time-clock/factory/facade.factory';

@Module({
  imports: [AuthModule],
  controllers: [TimeClockController],
  providers: [
    TimeClockService,
    {
      provide: TimeClockFacade,
      useFactory: () => TimeClockFacadeFactory.create(),
    },
  ],
  exports: [TimeClockService, TimeClockFacade],
})
export class TimeClockModule {}
