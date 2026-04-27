import { User } from '../domain/user.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { SearchResult } from '@/modules/@shared/repository/search-result';
import { UserSearchParams } from './user.filter';

export interface UserGateway {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  create(user: User, trx?: TransactionContext): Promise<void>;
  update(user: User, trx?: TransactionContext): Promise<void>;
  search(params: UserSearchParams): Promise<SearchResult<User>>;
}
