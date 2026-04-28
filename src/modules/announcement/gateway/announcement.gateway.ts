import { Announcement } from '../domain/announcement.entity';
import { AnnouncementStatus } from '@/modules/@shared/domain/enums';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';

export interface AnnouncementListParams {
  status?: AnnouncementStatus;
  page?: number;
  perPage?: number;
}

export interface AnnouncementGateway {
  create(a: Announcement, trx?: TransactionContext): Promise<void>;
  findById(id: string): Promise<Announcement | null>;
  update(a: Announcement, trx?: TransactionContext): Promise<void>;
  list(params: AnnouncementListParams): Promise<Announcement[]>;
  findAllActiveUserEmails(): Promise<string[]>;
  markRead(announcementId: string, userId: string): Promise<void>;
}
