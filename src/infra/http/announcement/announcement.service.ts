import { Inject, Injectable } from '@nestjs/common';
import AnnouncementFacade from '@/modules/announcement/facade/announcement.facade';
import {
  CreateDraftAnnouncementFacadeInputDto,
  ListAnnouncementsFacadeInputDto,
  MarkReadAnnouncementFacadeInputDto,
} from '@/modules/announcement/facade/announcement.facade.dto';

@Injectable()
export class AnnouncementService {
  @Inject(AnnouncementFacade)
  private readonly facade: AnnouncementFacade;

  createDraft(input: CreateDraftAnnouncementFacadeInputDto) {
    return this.facade.createDraft(input);
  }

  publish(id: string) {
    return this.facade.publish({ id });
  }

  findById(id: string) {
    return this.facade.findById({ id });
  }

  list(input: ListAnnouncementsFacadeInputDto) {
    return this.facade.list(input);
  }

  markRead(input: MarkReadAnnouncementFacadeInputDto) {
    return this.facade.markRead(input);
  }
}
