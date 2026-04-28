import { Justification } from '../domain/justification.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { SearchResult } from '@/modules/@shared/repository/search-result';
import { JustificationSearchParams } from './justification.filter';

export interface JustificationGateway {
  findById(id: string): Promise<Justification | null>;
  create(j: Justification, trx?: TransactionContext): Promise<void>;
  update(j: Justification, trx?: TransactionContext): Promise<void>;
  search(
    params: JustificationSearchParams,
  ): Promise<SearchResult<Justification>>;
}
