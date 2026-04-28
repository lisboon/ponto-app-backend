import { AnnouncementGateway } from '../../gateway/announcement.gateway';
import {
  ListAnnouncementsUseCaseInputDto,
  ListAnnouncementsUseCaseInterface,
  ListAnnouncementsUseCaseOutputDto,
} from './list.usecase.dto';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';

export default class ListAnnouncementsUseCase implements ListAnnouncementsUseCaseInterface {
  constructor(private readonly gateway: AnnouncementGateway) {}

  async execute(
    data: ListAnnouncementsUseCaseInputDto,
  ): Promise<ListAnnouncementsUseCaseOutputDto> {
    const items = await this.gateway.list({
      status: data.status,
      page: data.page,
      perPage: data.perPage,
    });
    return { items: items.map((a) => a.toJSON() as AnnouncementDto) };
  }
}
