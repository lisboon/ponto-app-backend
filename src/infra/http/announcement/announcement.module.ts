import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import AnnouncementFacade from '@/modules/announcement/facade/announcement.facade';
import AnnouncementFacadeFactory from '@/modules/announcement/factory/facade.factory';
import { MailerService } from '@/infra/services/mailer.service';

@Module({
  imports: [AuthModule],
  controllers: [AnnouncementController],
  providers: [
    MailerService,
    AnnouncementService,
    {
      provide: AnnouncementFacade,
      useFactory: (mailer: MailerService) =>
        AnnouncementFacadeFactory.create(mailer),
      inject: [MailerService],
    },
  ],
  exports: [AnnouncementService, AnnouncementFacade],
})
export class AnnouncementModule {}
