import { HolidayType } from '@/modules/@shared/domain/enums';

export interface HolidayDto {
  id: string;
  name: string;
  date: Date;
  type: HolidayType;
  description?: string;
  isRecurring: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateHolidayFacadeInputDto {
  name: string;
  date: string;
  type: HolidayType;
  description?: string;
  isRecurring?: boolean;
}
export type CreateHolidayFacadeOutputDto = HolidayDto;

export interface FindByIdHolidayFacadeInputDto {
  id: string;
}
export type FindByIdHolidayFacadeOutputDto = HolidayDto;

export interface UpdateHolidayFacadeInputDto {
  id: string;
  name?: string;
  date?: string;
  type?: HolidayType;
  description?: string;
  isRecurring?: boolean;
}
export type UpdateHolidayFacadeOutputDto = HolidayDto;

export interface DeleteHolidayFacadeInputDto {
  id: string;
}
export interface DeleteHolidayFacadeOutputDto {
  id: string;
}

export interface ListByYearHolidayFacadeInputDto {
  year: number;
}
export interface ListByYearHolidayFacadeOutputDto {
  items: HolidayDto[];
  year: number;
}

export interface HolidayFacadeInterface {
  create(
    data: CreateHolidayFacadeInputDto,
  ): Promise<CreateHolidayFacadeOutputDto>;
  findById(
    data: FindByIdHolidayFacadeInputDto,
  ): Promise<FindByIdHolidayFacadeOutputDto>;
  update(
    data: UpdateHolidayFacadeInputDto,
  ): Promise<UpdateHolidayFacadeOutputDto>;
  delete(
    data: DeleteHolidayFacadeInputDto,
  ): Promise<DeleteHolidayFacadeOutputDto>;
  listByYear(
    data: ListByYearHolidayFacadeInputDto,
  ): Promise<ListByYearHolidayFacadeOutputDto>;
}
