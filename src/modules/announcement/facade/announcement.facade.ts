import { CreateDraftUseCaseInterface } from '../usecase/create-draft/create-draft.usecase.dto';
import { PublishUseCaseInterface } from '../usecase/publish/publish.usecase.dto';
import { FindByIdAnnouncementUseCaseInterface } from '../usecase/find-by-id/find-by-id.usecase.dto';
import { ListAnnouncementsUseCaseInterface } from '../usecase/list/list.usecase.dto';
import { MarkReadUseCaseInterface } from '../usecase/mark-read/mark-read.usecase.dto';
import {
  AnnouncementFacadeInterface,
  CreateDraftAnnouncementFacadeInputDto,
  CreateDraftAnnouncementFacadeOutputDto,
  FindByIdAnnouncementFacadeInputDto,
  FindByIdAnnouncementFacadeOutputDto,
  ListAnnouncementsFacadeInputDto,
  ListAnnouncementsFacadeOutputDto,
  MarkReadAnnouncementFacadeInputDto,
  MarkReadAnnouncementFacadeOutputDto,
  PublishAnnouncementFacadeInputDto,
  PublishAnnouncementFacadeOutputDto,
} from './announcement.facade.dto';

export default class AnnouncementFacade implements AnnouncementFacadeInterface {
  constructor(
    private readonly createDraftUseCase: CreateDraftUseCaseInterface,
    private readonly publishUseCase: PublishUseCaseInterface,
    private readonly findByIdUseCase: FindByIdAnnouncementUseCaseInterface,
    private readonly listUseCase: ListAnnouncementsUseCaseInterface,
    private readonly markReadUseCase: MarkReadUseCaseInterface,
  ) {}

  createDraft(
    data: CreateDraftAnnouncementFacadeInputDto,
  ): Promise<CreateDraftAnnouncementFacadeOutputDto> {
    return this.createDraftUseCase.execute(data);
  }

  publish(
    data: PublishAnnouncementFacadeInputDto,
  ): Promise<PublishAnnouncementFacadeOutputDto> {
    return this.publishUseCase.execute(data);
  }

  findById(
    data: FindByIdAnnouncementFacadeInputDto,
  ): Promise<FindByIdAnnouncementFacadeOutputDto> {
    return this.findByIdUseCase.execute(data);
  }

  list(
    data: ListAnnouncementsFacadeInputDto,
  ): Promise<ListAnnouncementsFacadeOutputDto> {
    return this.listUseCase.execute(data);
  }

  markRead(
    data: MarkReadAnnouncementFacadeInputDto,
  ): Promise<MarkReadAnnouncementFacadeOutputDto> {
    return this.markReadUseCase.execute(data);
  }
}
