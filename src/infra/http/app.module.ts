import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WorkScheduleModule } from './work-schedule/work-schedule.module';
import { HolidayModule } from './holiday/holiday.module';
import { TimeClockModule } from './time-clock/time-clock.module';
import { JustificationModule } from './justification/justification.module';
import { MedicalLeaveModule } from './medical-leave/medical-leave.module';
import { HourBankModule } from './hour-bank/hour-bank.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { validateEnv } from '@/infra/config/env.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 30,
      },
    ]),
    AuthModule,
    UserModule,
    WorkScheduleModule,
    HolidayModule,
    TimeClockModule,
    JustificationModule,
    MedicalLeaveModule,
    HourBankModule,
    AnnouncementModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
