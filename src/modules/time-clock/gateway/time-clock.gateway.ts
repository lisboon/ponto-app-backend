import { WorkDay } from '../domain/work-day.entity';
import { TimeEntry } from '../domain/time-entry.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { SearchResult } from '@/modules/@shared/repository/search-result';
import { WorkDaySearchParams } from './time-clock.filter';

export interface TimeClockGateway {
  findDay(userId: string, date: Date): Promise<WorkDay | null>;
  findDayById(id: string): Promise<WorkDay | null>;
  saveDay(day: WorkDay, trx?: TransactionContext): Promise<void>;
  appendPunch(entry: TimeEntry, trx?: TransactionContext): Promise<void>;
  searchHistory(params: WorkDaySearchParams): Promise<SearchResult<WorkDay>>;
}
