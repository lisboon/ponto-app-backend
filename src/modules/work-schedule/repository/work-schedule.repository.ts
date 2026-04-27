import type {
  WorkSchedule as PrismaWorkScheduleRow,
  PrismaClient,
} from '@prisma/client';
import { WorkScheduleGateway } from '../gateway/work-schedule.gateway';
import { WorkScheduleSearchParams } from '../gateway/work-schedule.filter';
import { WorkSchedule } from '../domain/work-schedule.entity';
import { WeeklySchedule } from '../domain/types/schedule-data.shape';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { SearchResult } from '@/modules/@shared/repository/search-result';
import { SearchParams } from '@/modules/@shared/repository/search-params';
import WorkScheduleQueryBuilder from './work-schedule.query.builder';

export default class WorkScheduleRepository implements WorkScheduleGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntity(row: PrismaWorkScheduleRow): WorkSchedule {
    return new WorkSchedule({
      id: row.id,
      name: row.name,
      scheduleData: row.scheduleData as unknown as WeeklySchedule,
      active: row.active,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }

  async findById(id: string): Promise<WorkSchedule | null> {
    const row = await this.prisma.workSchedule.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? this.toEntity(row) : null;
  }

  async create(
    schedule: WorkSchedule,
    trx?: TransactionContext,
  ): Promise<void> {
    const client = this.getClient(trx);
    await client.workSchedule.create({
      data: {
        id: schedule.id,
        name: schedule.name,
        scheduleData: schedule.scheduleData as unknown as object,
        active: schedule.active,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      },
    });
  }

  async update(
    schedule: WorkSchedule,
    trx?: TransactionContext,
  ): Promise<void> {
    const client = this.getClient(trx);
    await client.workSchedule.update({
      where: { id: schedule.id },
      data: {
        name: schedule.name,
        scheduleData: schedule.scheduleData as unknown as object,
        active: schedule.active,
        updatedAt: schedule.updatedAt,
        deletedAt: schedule.deletedAt,
      },
    });
  }

  async search(
    params: WorkScheduleSearchParams,
  ): Promise<SearchResult<WorkSchedule>> {
    const searchParams = new SearchParams({
      filter: params.filter,
      sort: params.sort,
      sortDir: params.sortDir,
      page: params.page,
      perPage: params.perPage,
    });

    const query = new WorkScheduleQueryBuilder(
      searchParams.filter ?? {},
      { sort: searchParams.sort, sortDir: searchParams.sortDir },
      { page: searchParams.page, perPage: searchParams.perPage },
    ).build();

    const where = { ...query.where, deletedAt: null };

    const [items, count] = await Promise.all([
      this.prisma.workSchedule.findMany({ ...query, where }),
      this.prisma.workSchedule.count({ where }),
    ]);

    return new SearchResult<WorkSchedule>({
      items: items.map((item) => this.toEntity(item)),
      total: count,
      perPage: searchParams.perPage,
      currentPage: searchParams.page,
    });
  }
}
