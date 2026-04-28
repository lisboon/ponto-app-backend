import type {
  Announcement as PrismaAnnouncementRow,
  PrismaClient,
} from '@prisma/client';
import {
  AnnouncementGateway,
  AnnouncementListParams,
} from '../gateway/announcement.gateway';
import { Announcement } from '../domain/announcement.entity';
import { AnnouncementStatus } from '@/modules/@shared/domain/enums';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';

export default class AnnouncementRepository implements AnnouncementGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntity(row: PrismaAnnouncementRow): Announcement {
    return new Announcement({
      id: row.id,
      authorId: row.authorId,
      title: row.title,
      content: row.content,
      status: row.status as AnnouncementStatus,
      publishedAt: row.publishedAt ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }

  async create(a: Announcement, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.announcement.create({
      data: {
        id: a.id,
        authorId: a.authorId,
        title: a.title,
        content: a.content,
        status: a.status,
        publishedAt: a.publishedAt,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Announcement | null> {
    const row = await this.prisma.announcement.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? this.toEntity(row) : null;
  }

  async update(a: Announcement, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.announcement.update({
      where: { id: a.id },
      data: {
        title: a.title,
        content: a.content,
        status: a.status,
        publishedAt: a.publishedAt,
        updatedAt: a.updatedAt,
        deletedAt: a.deletedAt,
      },
    });
  }

  async list(params: AnnouncementListParams): Promise<Announcement[]> {
    const { status, page = 1, perPage = 20 } = params;
    const rows = await this.prisma.announcement.findMany({
      where: { deletedAt: null, ...(status ? { status } : {}) },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findAllActiveUserEmails(): Promise<string[]> {
    const users = await this.prisma.user.findMany({
      where: { active: true },
      select: { email: true },
    });
    return users.map((u) => u.email);
  }

  async markRead(announcementId: string, userId: string): Promise<void> {
    await this.prisma.announcementRead.upsert({
      where: { announcementId_userId: { announcementId, userId } },
      create: { announcementId, userId },
      update: {},
    });
  }
}
