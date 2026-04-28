import type {
  Justification as PrismaJustificationRow,
  PrismaClient,
} from '@prisma/client';
import { JustificationGateway } from '../gateway/justification.gateway';
import { JustificationSearchParams } from '../gateway/justification.filter';
import { Justification } from '../domain/justification.entity';
import { JustificationStatus } from '@/modules/@shared/domain/enums';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { SearchResult } from '@/modules/@shared/repository/search-result';

export default class JustificationRepository implements JustificationGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntity(row: PrismaJustificationRow): Justification {
    return new Justification({
      id: row.id,
      userId: row.userId,
      workDayId: row.workDayId,
      createdBy: row.createdBy,
      description: row.description,
      attachmentUrl: row.attachmentUrl ?? undefined,
      status: row.status as JustificationStatus,
      reviewedBy: row.reviewedBy ?? undefined,
      reviewedAt: row.reviewedAt ?? undefined,
      reviewNote: row.reviewNote ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string): Promise<Justification | null> {
    const row = await this.prisma.justification.findFirst({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async create(j: Justification, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.justification.create({
      data: {
        id: j.id,
        userId: j.userId,
        workDayId: j.workDayId,
        createdBy: j.createdBy,
        description: j.description,
        attachmentUrl: j.attachmentUrl,
        status: j.status,
        reviewedBy: j.reviewedBy,
        reviewedAt: j.reviewedAt,
        reviewNote: j.reviewNote,
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
      },
    });
  }

  async update(j: Justification, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.justification.update({
      where: { id: j.id },
      data: {
        description: j.description,
        attachmentUrl: j.attachmentUrl,
        status: j.status,
        reviewedBy: j.reviewedBy,
        reviewedAt: j.reviewedAt,
        reviewNote: j.reviewNote,
        updatedAt: j.updatedAt,
      },
    });
  }

  async search(
    params: JustificationSearchParams,
  ): Promise<SearchResult<Justification>> {
    const filter = params.filter ?? {};
    const page = params.page && params.page > 0 ? params.page : 1;
    const perPage = Math.min(
      params.perPage && params.perPage > 0 ? params.perPage : 20,
      100,
    );

    const where: Record<string, unknown> = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.status) where.status = filter.status;
    if (filter.workDayId) where.workDayId = filter.workDayId;

    const orderBy = params.sort
      ? { [params.sort]: params.sortDir ?? 'desc' }
      : { createdAt: 'desc' as const };

    const [items, total] = await Promise.all([
      this.prisma.justification.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.justification.count({ where }),
    ]);

    return new SearchResult<Justification>({
      items: items.map((row) => this.toEntity(row)),
      total,
      currentPage: page,
      perPage,
    });
  }
}
