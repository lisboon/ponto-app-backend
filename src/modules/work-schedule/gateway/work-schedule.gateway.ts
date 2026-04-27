import { WorkSchedule } from '../domain/work-schedule.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { SearchResult } from '@/modules/@shared/repository/search-result';
import { WorkScheduleSearchParams } from './work-schedule.filter';

export interface WorkScheduleGateway {
  findById(id: string): Promise<WorkSchedule | null>;
  create(schedule: WorkSchedule, trx?: TransactionContext): Promise<void>;
  update(schedule: WorkSchedule, trx?: TransactionContext): Promise<void>;
  search(params: WorkScheduleSearchParams): Promise<SearchResult<WorkSchedule>>;
}
