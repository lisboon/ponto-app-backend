import { JustificationStatus } from '@/modules/@shared/domain/enums';
import { SortDirection } from '@/modules/@shared/repository/search-params';

export interface JustificationFilter {
  userId?: string;
  status?: JustificationStatus;
  workDayId?: string;
}

export interface JustificationSearchParams {
  filter?: JustificationFilter;
  sort?: string | null;
  sortDir?: SortDirection | null;
  page?: number;
  perPage?: number;
}
