import { AnnouncementGateway } from '../../gateway/announcement.gateway';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';
import { Announcement } from '../../domain/announcement.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  FindByIdAnnouncementUseCaseInputDto,
  FindByIdAnnouncementUseCaseInterface,
  FindByIdAnnouncementUseCaseOutputDto,
} from './find-by-id.usecase.dto';

export default class FindByIdAnnouncementUseCase implements FindByIdAnnouncementUseCaseInterface {
  constructor(private readonly gateway: AnnouncementGateway) {}

  async execute(
    data: FindByIdAnnouncementUseCaseInputDto,
  ): Promise<FindByIdAnnouncementUseCaseOutputDto> {
    const a = await this.gateway.findById(data.id);
    if (!a) throw new NotFoundError(data.id, Announcement);
    return a.toJSON() as AnnouncementDto;
  }
}
