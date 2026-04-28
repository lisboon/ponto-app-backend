import { AnnouncementGateway } from '../../gateway/announcement.gateway';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';
import { Announcement } from '../../domain/announcement.entity';
import {
  CreateDraftUseCaseInputDto,
  CreateDraftUseCaseInterface,
  CreateDraftUseCaseOutputDto,
} from './create-draft.usecase.dto';

export default class CreateDraftUseCase implements CreateDraftUseCaseInterface {
  constructor(private readonly gateway: AnnouncementGateway) {}

  async execute(
    data: CreateDraftUseCaseInputDto,
  ): Promise<CreateDraftUseCaseOutputDto> {
    const a = Announcement.create({
      authorId: data.authorId,
      title: data.title,
      content: data.content,
    });
    await this.gateway.create(a);
    return a.toJSON() as AnnouncementDto;
  }
}
