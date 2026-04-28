import { SortDirection } from '@/modules/@shared/repository/search-params';
import { DayStatus } from '@/modules/@shared/domain/enums';

export interface WorkDayFilter {
  userId?: string;
  status?: DayStatus;
  fromDate?: Date;
  toDate?: Date;
}

export interface WorkDaySearchParams {
  filter?: WorkDayFilter;
  sort?: string | null;
  sortDir?: SortDirection | null;
  page?: number;
  perPage?: number;
}
