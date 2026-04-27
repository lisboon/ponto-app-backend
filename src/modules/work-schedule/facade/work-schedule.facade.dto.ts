import { WeeklySchedule } from '../domain/types/schedule-data.shape';

export interface WorkScheduleDto {
  id: string;
  name: string;
  scheduleData: WeeklySchedule;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateWorkScheduleFacadeInputDto {
  name: string;
  scheduleData: WeeklySchedule;
}
export type CreateWorkScheduleFacadeOutputDto = WorkScheduleDto;

export interface FindByIdWorkScheduleFacadeInputDto {
  id: string;
}
export type FindByIdWorkScheduleFacadeOutputDto = WorkScheduleDto;

export interface UpdateWorkScheduleFacadeInputDto {
  id: string;
  name?: string;
  scheduleData?: WeeklySchedule;
}
export type UpdateWorkScheduleFacadeOutputDto = WorkScheduleDto;

export interface DeleteWorkScheduleFacadeInputDto {
  id: string;
}
export interface DeleteWorkScheduleFacadeOutputDto {
  id: string;
}

export interface ListWorkSchedulesFacadeInputDto {
  name?: string;
  active?: boolean;
  sort?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
export interface ListWorkSchedulesFacadeOutputDto {
  items: WorkScheduleDto[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface WorkScheduleFacadeInterface {
  create(
    data: CreateWorkScheduleFacadeInputDto,
  ): Promise<CreateWorkScheduleFacadeOutputDto>;
  findById(
    data: FindByIdWorkScheduleFacadeInputDto,
  ): Promise<FindByIdWorkScheduleFacadeOutputDto>;
  update(
    data: UpdateWorkScheduleFacadeInputDto,
  ): Promise<UpdateWorkScheduleFacadeOutputDto>;
  delete(
    data: DeleteWorkScheduleFacadeInputDto,
  ): Promise<DeleteWorkScheduleFacadeOutputDto>;
  list(
    data: ListWorkSchedulesFacadeInputDto,
  ): Promise<ListWorkSchedulesFacadeOutputDto>;
}
