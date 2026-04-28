export interface MedicalLeaveDto {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  attachmentUrl: string;
  reason?: string;
  createdBy: string;
  revokedAt?: Date;
  revokedBy?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateMedicalLeaveFacadeInputDto {
  userId: string;
  startDate: string;
  endDate: string;
  attachmentUrl: string;
  reason?: string;
  createdBy: string;
}
export type CreateMedicalLeaveFacadeOutputDto = MedicalLeaveDto;

export interface FindByIdMedicalLeaveFacadeInputDto {
  id: string;
}
export type FindByIdMedicalLeaveFacadeOutputDto = MedicalLeaveDto;

export interface ListByUserMedicalLeaveFacadeInputDto {
  userId: string;
  activeOnly?: boolean;
}
export interface ListByUserMedicalLeaveFacadeOutputDto {
  items: MedicalLeaveDto[];
}

export interface RevokeMedicalLeaveFacadeInputDto {
  id: string;
  revokedBy: string;
}
export type RevokeMedicalLeaveFacadeOutputDto = MedicalLeaveDto;

export interface MedicalLeaveFacadeInterface {
  create(
    data: CreateMedicalLeaveFacadeInputDto,
  ): Promise<CreateMedicalLeaveFacadeOutputDto>;
  findById(
    data: FindByIdMedicalLeaveFacadeInputDto,
  ): Promise<FindByIdMedicalLeaveFacadeOutputDto>;
  listByUser(
    data: ListByUserMedicalLeaveFacadeInputDto,
  ): Promise<ListByUserMedicalLeaveFacadeOutputDto>;
  revoke(
    data: RevokeMedicalLeaveFacadeInputDto,
  ): Promise<RevokeMedicalLeaveFacadeOutputDto>;
}
