import { AnnouncementStatus } from '@/modules/@shared/domain/enums';

export interface AnnouncementDto {
  id: string;
  authorId: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  publishedAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateDraftAnnouncementFacadeInputDto {
  authorId: string;
  title: string;
  content: string;
}
export type CreateDraftAnnouncementFacadeOutputDto = AnnouncementDto;

export interface PublishAnnouncementFacadeInputDto {
  id: string;
}
export type PublishAnnouncementFacadeOutputDto = AnnouncementDto;

export interface FindByIdAnnouncementFacadeInputDto {
  id: string;
}
export type FindByIdAnnouncementFacadeOutputDto = AnnouncementDto;

export interface ListAnnouncementsFacadeInputDto {
  status?: AnnouncementStatus;
  page?: number;
  perPage?: number;
}
export interface ListAnnouncementsFacadeOutputDto {
  items: AnnouncementDto[];
}

export interface MarkReadAnnouncementFacadeInputDto {
  announcementId: string;
  userId: string;
}
export interface MarkReadAnnouncementFacadeOutputDto {
  ok: true;
}

export interface AnnouncementFacadeInterface {
  createDraft(
    data: CreateDraftAnnouncementFacadeInputDto,
  ): Promise<CreateDraftAnnouncementFacadeOutputDto>;
  publish(
    data: PublishAnnouncementFacadeInputDto,
  ): Promise<PublishAnnouncementFacadeOutputDto>;
  findById(
    data: FindByIdAnnouncementFacadeInputDto,
  ): Promise<FindByIdAnnouncementFacadeOutputDto>;
  list(
    data: ListAnnouncementsFacadeInputDto,
  ): Promise<ListAnnouncementsFacadeOutputDto>;
  markRead(
    data: MarkReadAnnouncementFacadeInputDto,
  ): Promise<MarkReadAnnouncementFacadeOutputDto>;
}
