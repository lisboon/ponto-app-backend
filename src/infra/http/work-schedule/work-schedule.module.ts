import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkScheduleController } from './work-schedule.controller';
import { WorkScheduleService } from './work-schedule.service';
import WorkScheduleFacade from '@/modules/work-schedule/facade/work-schedule.facade';
import WorkScheduleFacadeFactory from '@/modules/work-schedule/factory/facade.factory';

@Module({
  imports: [AuthModule],
  controllers: [WorkScheduleController],
  providers: [
    WorkScheduleService,
    {
      provide: WorkScheduleFacade,
      useFactory: () => WorkScheduleFacadeFactory.create(),
    },
  ],
  exports: [WorkScheduleService, WorkScheduleFacade],
})
export class WorkScheduleModule {}
