import { DayStatus, PunchType } from '@/modules/@shared/domain/enums';

export interface TimeEntryDto {
  id: string;
  workDayId: string;
  punchType: PunchType;
  punchedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  outsideStudio: boolean;
  isManual: boolean;
  manualNote?: string;
  createdAt: Date;
}

export interface WorkDayDto {
  id: string;
  userId: string;
  date: Date;
  status: DayStatus;
  expectedMinutes?: number;
  workedMinutes?: number;
  breakMinutes?: number;
  overtimeMinutes?: number;
  hourBankDelta?: number;
  medicalLeaveId?: string;
  closedAt?: Date;
  punches: TimeEntryDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PunchFacadeInputDto {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  outsideStudio: boolean;
}
export interface PunchFacadeOutputDto {
  workDay: WorkDayDto;
  registeredPunch: TimeEntryDto;
}

export interface ManualPunchFacadeInputDto {
  userId: string;
  punchType: PunchType;
  punchedAt: string;
  manualNote?: string;
}
export interface ManualPunchFacadeOutputDto {
  workDay: WorkDayDto;
  registeredPunch: TimeEntryDto;
}

export interface FindDayByDateFacadeInputDto {
  userId: string;
  date: string;
}
export type FindDayByDateFacadeOutputDto = WorkDayDto | null;

export interface ListHistoryFacadeInputDto {
  userId: string;
  fromDate?: string;
  toDate?: string;
  status?: DayStatus;
  page?: number;
  perPage?: number;
}
export interface ListHistoryFacadeOutputDto {
  items: WorkDayDto[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
}

export interface RecalculateDayFacadeInputDto {
  userId: string;
  date: string;
}
export type RecalculateDayFacadeOutputDto = WorkDayDto;

export interface CloseDayFacadeInputDto {
  userId: string;
  date: string;
}
export type CloseDayFacadeOutputDto = WorkDayDto;

export interface TimeClockFacadeInterface {
  punch(data: PunchFacadeInputDto): Promise<PunchFacadeOutputDto>;
  manualPunch(
    data: ManualPunchFacadeInputDto,
  ): Promise<ManualPunchFacadeOutputDto>;
  findDayByDate(
    data: FindDayByDateFacadeInputDto,
  ): Promise<FindDayByDateFacadeOutputDto>;
  listHistory(
    data: ListHistoryFacadeInputDto,
  ): Promise<ListHistoryFacadeOutputDto>;
  recalculateDay(
    data: RecalculateDayFacadeInputDto,
  ): Promise<RecalculateDayFacadeOutputDto>;
  closeDay(data: CloseDayFacadeInputDto): Promise<CloseDayFacadeOutputDto>;
}
