import { AnnouncementGateway } from '../../gateway/announcement.gateway';
import {
  MarkReadUseCaseInputDto,
  MarkReadUseCaseInterface,
  MarkReadUseCaseOutputDto,
} from './mark-read.usecase.dto';

export default class MarkReadUseCase implements MarkReadUseCaseInterface {
  constructor(private readonly gateway: AnnouncementGateway) {}

  async execute(
    data: MarkReadUseCaseInputDto,
  ): Promise<MarkReadUseCaseOutputDto> {
    await this.gateway.markRead(data.announcementId, data.userId);
    return { ok: true };
  }
}
