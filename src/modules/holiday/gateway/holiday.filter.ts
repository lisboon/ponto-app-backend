import { HolidayType } from '@/modules/@shared/domain/enums';

export interface HolidayFilter {
  name?: string;
  type?: HolidayType;
  isRecurring?: boolean;
}
