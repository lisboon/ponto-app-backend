import { EventHandlerInterface } from '@/modules/@shared/domain/events/event-handler.interface';
import { AnnouncementPublishedEvent } from '../announcement-published.event';
import { AnnouncementGateway } from '../../gateway/announcement.gateway';
import { MailerService } from '@/infra/services/mailer.service';

export class AnnouncementPublishedHandler implements EventHandlerInterface<AnnouncementPublishedEvent> {
  constructor(
    private readonly gateway: AnnouncementGateway,
    private readonly mailer: MailerService,
  ) {}

  async handle(event: AnnouncementPublishedEvent): Promise<void> {
    const { title, content } = event.payload;
    const emails = await this.gateway.findAllActiveUserEmails();
    if (emails.length === 0) return;

    await this.mailer.send({
      to: emails,
      subject: `[Ponto] ${title}`,
      html: `<h2>${title}</h2><div>${content}</div>`,
    });
  }
}
