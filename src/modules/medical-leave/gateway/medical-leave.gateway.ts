import { MedicalLeave } from '../domain/medical-leave.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { MedicalLeaveFilter } from './medical-leave.filter';

export interface MedicalLeaveGateway {
  findById(id: string): Promise<MedicalLeave | null>;
  listByUser(filter: MedicalLeaveFilter): Promise<MedicalLeave[]>;
  create(ml: MedicalLeave, trx?: TransactionContext): Promise<void>;
  update(ml: MedicalLeave, trx?: TransactionContext): Promise<void>;
}
