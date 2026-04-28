import { JustificationStatus } from '@/modules/@shared/domain/enums';

export interface JustificationDto {
  id: string;
  userId: string;
  workDayId: string;
  createdBy: string;
  description: string;
  attachmentUrl?: string;
  status: JustificationStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNote?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateJustificationFacadeInputDto {
  userId: string;
  workDayId: string;
  createdBy: string;
  description: string;
  attachmentUrl?: string;
}
export type CreateJustificationFacadeOutputDto = JustificationDto;

export interface FindByIdJustificationFacadeInputDto {
  id: string;
}
export type FindByIdJustificationFacadeOutputDto = JustificationDto;

export interface UpdateJustificationFacadeInputDto {
  id: string;
  description?: string;
  attachmentUrl?: string;
}
export type UpdateJustificationFacadeOutputDto = JustificationDto;

export interface ApproveJustificationFacadeInputDto {
  id: string;
  reviewerId: string;
  reviewNote?: string;
}
export type ApproveJustificationFacadeOutputDto = JustificationDto;

export interface RejectJustificationFacadeInputDto {
  id: string;
  reviewerId: string;
  reviewNote: string;
}
export type RejectJustificationFacadeOutputDto = JustificationDto;

export interface ListJustificationsFacadeInputDto {
  userId?: string;
  status?: JustificationStatus;
  workDayId?: string;
  sort?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
export interface ListJustificationsFacadeOutputDto {
  items: JustificationDto[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface JustificationFacadeInterface {
  create(
    data: CreateJustificationFacadeInputDto,
  ): Promise<CreateJustificationFacadeOutputDto>;
  findById(
    data: FindByIdJustificationFacadeInputDto,
  ): Promise<FindByIdJustificationFacadeOutputDto>;
  update(
    data: UpdateJustificationFacadeInputDto,
  ): Promise<UpdateJustificationFacadeOutputDto>;
  approve(
    data: ApproveJustificationFacadeInputDto,
  ): Promise<ApproveJustificationFacadeOutputDto>;
  reject(
    data: RejectJustificationFacadeInputDto,
  ): Promise<RejectJustificationFacadeOutputDto>;
  list(
    data: ListJustificationsFacadeInputDto,
  ): Promise<ListJustificationsFacadeOutputDto>;
}
