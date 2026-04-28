import { Holiday } from '../domain/holiday.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';

export interface HolidayGateway {
  findById(id: string): Promise<Holiday | null>;
  findByDate(date: Date): Promise<Holiday | null>;
  listByYear(year: number): Promise<Holiday[]>;
  create(holiday: Holiday, trx?: TransactionContext): Promise<void>;
  update(holiday: Holiday, trx?: TransactionContext): Promise<void>;
}
