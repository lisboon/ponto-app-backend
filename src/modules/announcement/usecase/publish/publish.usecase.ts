import { AnnouncementGateway } from '../../gateway/announcement.gateway';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';
import { Announcement } from '../../domain/announcement.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { EventDispatcherInterface } from '@/modules/@shared/domain/events/event-dispatcher.interface';
import {
  PublishUseCaseInputDto,
  PublishUseCaseInterface,
  PublishUseCaseOutputDto,
} from './publish.usecase.dto';

export default class PublishUseCase implements PublishUseCaseInterface {
  constructor(
    private readonly gateway: AnnouncementGateway,
    private readonly eventDispatcher: EventDispatcherInterface,
  ) {}

  async execute(
    data: PublishUseCaseInputDto,
  ): Promise<PublishUseCaseOutputDto> {
    const a = await this.gateway.findById(data.id);
    if (!a) throw new NotFoundError(data.id, Announcement);

    a.publish();
    await this.gateway.update(a);

    for (const event of a.pullEvents()) {
      await this.eventDispatcher.dispatch(event);
    }

    return a.toJSON() as AnnouncementDto;
  }
}
