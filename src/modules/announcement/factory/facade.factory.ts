import prisma from '@/infra/database/prisma.instance';
import { EventDispatcher } from '@/modules/@shared/domain/events/event-dispatcher';
import { MailerService } from '@/infra/services/mailer.service';
import AnnouncementRepository from '../repository/announcement.repository';
import CreateDraftUseCase from '../usecase/create-draft/create-draft.usecase';
import PublishUseCase from '../usecase/publish/publish.usecase';
import FindByIdAnnouncementUseCase from '../usecase/find-by-id/find-by-id.usecase';
import ListAnnouncementsUseCase from '../usecase/list/list.usecase';
import MarkReadUseCase from '../usecase/mark-read/mark-read.usecase';
import { AnnouncementPublishedHandler } from '../event/handlers/announcement-published.handler';
import AnnouncementFacade from '../facade/announcement.facade';

export const announcementEventDispatcher = new EventDispatcher();

export default class AnnouncementFacadeFactory {
  static create(mailer: MailerService): AnnouncementFacade {
    const repository = new AnnouncementRepository(prisma);

    announcementEventDispatcher.clear();
    announcementEventDispatcher.register(
      'AnnouncementPublishedEvent',
      new AnnouncementPublishedHandler(repository, mailer),
    );

    const createDraftUseCase = new CreateDraftUseCase(repository);
    const publishUseCase = new PublishUseCase(
      repository,
      announcementEventDispatcher,
    );
    const findByIdUseCase = new FindByIdAnnouncementUseCase(repository);
    const listUseCase = new ListAnnouncementsUseCase(repository);
    const markReadUseCase = new MarkReadUseCase(repository);

    return new AnnouncementFacade(
      createDraftUseCase,
      publishUseCase,
      findByIdUseCase,
      listUseCase,
      markReadUseCase,
    );
  }
}
