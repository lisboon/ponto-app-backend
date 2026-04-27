import { SortDirection } from '@/modules/@shared/repository/search-params';
import { UserRole } from '@/modules/@shared/domain/enums';

export interface UserFilter {
  name?: string;
  email?: string;
  role?: UserRole;
  active?: boolean;
}

export interface UserSearchParams {
  filter?: UserFilter;
  sort?: string | null;
  sortDir?: SortDirection | null;
  page?: number;
  perPage?: number;
}
