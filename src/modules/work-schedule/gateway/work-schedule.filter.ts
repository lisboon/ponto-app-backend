import { SortDirection } from '@/modules/@shared/repository/search-params';

export interface WorkScheduleFilter {
  name?: string;
  active?: boolean;
}

export interface WorkScheduleSearchParams {
  filter?: WorkScheduleFilter;
  sort?: string | null;
  sortDir?: SortDirection | null;
  page?: number;
  perPage?: number;
}
