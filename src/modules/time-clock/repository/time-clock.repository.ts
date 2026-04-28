import type {
  PrismaClient,
  WorkDay as PrismaWorkDayRow,
  TimeEntry as PrismaTimeEntryRow,
} from '@prisma/client';
import { TimeClockGateway } from '../gateway/time-clock.gateway';
import { WorkDaySearchParams } from '../gateway/time-clock.filter';
import { WorkDay } from '../domain/work-day.entity';
import { TimeEntry } from '../domain/time-entry.entity';
import { DayStatus, PunchType } from '@/modules/@shared/domain/enums';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { SearchResult } from '@/modules/@shared/repository/search-result';

type WorkDayRowWithPunches = PrismaWorkDayRow & {
  punches?: PrismaTimeEntryRow[];
};

export default class TimeClockRepository implements TimeClockGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntryEntity(row: PrismaTimeEntryRow): TimeEntry {
    return new TimeEntry({
      id: row.id,
      workDayId: row.workDayId,
      punchType: row.punchType as PunchType,
      punchedAt: row.punchedAt,
      ipAddress: row.ipAddress ?? undefined,
      userAgent: row.userAgent ?? undefined,
      outsideStudio: row.outsideStudio,
      isManual: row.isManual,
      manualNote: row.manualNote ?? undefined,
      createdAt: row.createdAt,
    });
  }

  private toDayEntity(row: WorkDayRowWithPunches): WorkDay {
    const punches = (row.punches ?? []).map((p) => this.toEntryEntity(p));
    return new WorkDay({
      id: row.id,
      userId: row.userId,
      date: row.date,
      status: row.status as DayStatus,
      expectedMinutes: row.expectedMinutes ?? undefined,
      workedMinutes: row.workedMinutes ?? undefined,
      breakMinutes: row.breakMinutes ?? undefined,
      overtimeMinutes: row.overtimeMinutes ?? undefined,
      hourBankDelta: row.hourBankDelta ?? undefined,
      medicalLeaveId: row.medicalLeaveId ?? undefined,
      closedAt: row.closedAt ?? undefined,
      punches,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findDay(userId: string, date: Date): Promise<WorkDay | null> {
    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const row = await this.prisma.workDay.findUnique({
      where: { userId_date: { userId, date: dayStart } },
      include: { punches: { orderBy: { punchedAt: 'asc' } } },
    });
    return row ? this.toDayEntity(row) : null;
  }

  async findDayById(id: string): Promise<WorkDay | null> {
    const row = await this.prisma.workDay.findFirst({
      where: { id },
      include: { punches: { orderBy: { punchedAt: 'asc' } } },
    });
    return row ? this.toDayEntity(row) : null;
  }

  async saveDay(day: WorkDay, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.workDay.upsert({
      where: { userId_date: { userId: day.userId, date: day.date } },
      create: {
        id: day.id,
        userId: day.userId,
        date: day.date,
        status: day.status,
        expectedMinutes: day.expectedMinutes,
        workedMinutes: day.workedMinutes,
        breakMinutes: day.breakMinutes,
        overtimeMinutes: day.overtimeMinutes,
        hourBankDelta: day.hourBankDelta,
        medicalLeaveId: day.medicalLeaveId,
        closedAt: day.closedAt,
        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
      },
      update: {
        status: day.status,
        expectedMinutes: day.expectedMinutes,
        workedMinutes: day.workedMinutes,
        breakMinutes: day.breakMinutes,
        overtimeMinutes: day.overtimeMinutes,
        hourBankDelta: day.hourBankDelta,
        medicalLeaveId: day.medicalLeaveId,
        closedAt: day.closedAt,
        updatedAt: day.updatedAt,
      },
    });
  }

  async appendPunch(entry: TimeEntry, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.timeEntry.create({
      data: {
        id: entry.id,
        workDayId: entry.workDayId,
        punchType: entry.punchType,
        punchedAt: entry.punchedAt,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        outsideStudio: entry.outsideStudio,
        isManual: entry.isManual,
        manualNote: entry.manualNote,
        createdAt: entry.createdAt,
      },
    });
  }

  async searchHistory(
    params: WorkDaySearchParams,
  ): Promise<SearchResult<WorkDay>> {
    const filter = params.filter ?? {};
    const page = params.page && params.page > 0 ? params.page : 1;
    const perPage = Math.min(
      params.perPage && params.perPage > 0 ? params.perPage : 20,
      100,
    );

    const where: Record<string, unknown> = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.status) where.status = filter.status;
    if (filter.fromDate || filter.toDate) {
      const dateRange: Record<string, Date> = {};
      if (filter.fromDate) dateRange.gte = filter.fromDate;
      if (filter.toDate) dateRange.lte = filter.toDate;
      where.date = dateRange;
    }

    const orderBy = params.sort
      ? { [params.sort]: params.sortDir ?? 'desc' }
      : { date: 'desc' as const };

    const [items, total] = await Promise.all([
      this.prisma.workDay.findMany({
        where,
        include: { punches: { orderBy: { punchedAt: 'asc' } } },
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.workDay.count({ where }),
    ]);

    return new SearchResult<WorkDay>({
      items: items.map((row) => this.toDayEntity(row)),
      total,
      currentPage: page,
      perPage,
    });
  }
}
