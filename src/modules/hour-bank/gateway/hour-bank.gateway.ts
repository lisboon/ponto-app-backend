import { HourBank } from '../domain/hour-bank.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';

export interface HourBankGateway {
  findByUserId(userId: string): Promise<HourBank | null>;
  upsert(hb: HourBank, trx?: TransactionContext): Promise<void>;
  sumClosedDeltaForUser(userId: string): Promise<number>;
}
