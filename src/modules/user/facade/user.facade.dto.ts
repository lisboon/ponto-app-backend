import { ContractType, UserRole } from '@/modules/@shared/domain/enums';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  position?: string;
  contractType?: ContractType;
  weeklyMinutes?: number;
  hourlyRate?: number;
  workScheduleId?: string;
  hireDate?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface RegisterFacadeInputDto {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
  position?: string;
  contractType?: ContractType;
  weeklyMinutes?: number;
  hourlyRate?: number;
  workScheduleId?: string;
  hireDate?: string;
}
export interface RegisterFacadeOutputDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginFacadeInputDto {
  email: string;
  password: string;
}
export interface LoginFacadeOutputDto {
  accessToken: string;
  user: { id: string; email: string; name: string; role: UserRole };
}

export interface FindByIdFacadeInputDto {
  id: string;
}
export type FindByIdFacadeOutputDto = UserDto;

export interface UpdateProfileFacadeInputDto {
  id: string;
  email?: string;
  name?: string;
  password?: string;
  avatarUrl?: string;
  position?: string;
  contractType?: ContractType;
  weeklyMinutes?: number;
  hourlyRate?: number;
  hireDate?: string;
}
export type UpdateProfileFacadeOutputDto = UserDto;

export interface ChangeRoleFacadeInputDto {
  id: string;
  role: UserRole;
}
export type ChangeRoleFacadeOutputDto = UserDto;

export interface AssignWorkScheduleFacadeInputDto {
  id: string;
  workScheduleId?: string | null;
}
export type AssignWorkScheduleFacadeOutputDto = UserDto;

export interface ListUsersFacadeInputDto {
  name?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
  sort?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
export interface ListUsersFacadeOutputDto {
  items: UserDto[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface DeactivateUserFacadeInputDto {
  id: string;
}
export type DeactivateUserFacadeOutputDto = UserDto;

export interface ReactivateUserFacadeInputDto {
  id: string;
}
export type ReactivateUserFacadeOutputDto = UserDto;

export interface DeleteUserFacadeInputDto {
  id: string;
}
export interface DeleteUserFacadeOutputDto {
  id: string;
}

export interface UserFacadeInterface {
  register(data: RegisterFacadeInputDto): Promise<RegisterFacadeOutputDto>;
  login(data: LoginFacadeInputDto): Promise<LoginFacadeOutputDto>;
  findById(data: FindByIdFacadeInputDto): Promise<FindByIdFacadeOutputDto>;
  updateProfile(
    data: UpdateProfileFacadeInputDto,
  ): Promise<UpdateProfileFacadeOutputDto>;
  changeRole(
    data: ChangeRoleFacadeInputDto,
  ): Promise<ChangeRoleFacadeOutputDto>;
  assignWorkSchedule(
    data: AssignWorkScheduleFacadeInputDto,
  ): Promise<AssignWorkScheduleFacadeOutputDto>;
  list(data: ListUsersFacadeInputDto): Promise<ListUsersFacadeOutputDto>;
  deactivate(
    data: DeactivateUserFacadeInputDto,
  ): Promise<DeactivateUserFacadeOutputDto>;
  reactivate(
    data: ReactivateUserFacadeInputDto,
  ): Promise<ReactivateUserFacadeOutputDto>;
  delete(data: DeleteUserFacadeInputDto): Promise<DeleteUserFacadeOutputDto>;
}
