import type { Holiday as PrismaHolidayRow, PrismaClient } from '@prisma/client';
import { HolidayGateway } from '../gateway/holiday.gateway';
import { Holiday } from '../domain/holiday.entity';
import { HolidayType } from '@/modules/@shared/domain/enums';
import { findHolidayForDate } from '../domain/services/holiday-resolver.service';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';

export default class HolidayRepository implements HolidayGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntity(row: PrismaHolidayRow): Holiday {
    return new Holiday({
      id: row.id,
      name: row.name,
      date: row.date,
      type: row.type as HolidayType,
      description: row.description ?? undefined,
      isRecurring: row.isRecurring,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }

  async findById(id: string): Promise<Holiday | null> {
    const row = await this.prisma.holiday.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? this.toEntity(row) : null;
  }

  async findByDate(date: Date): Promise<Holiday | null> {
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const yearEnd = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

    const rows = await this.prisma.holiday.findMany({
      where: {
        deletedAt: null,
        OR: [{ date: { gte: yearStart, lte: yearEnd } }, { isRecurring: true }],
      },
    });

    const holidays = rows.map((r) => this.toEntity(r));
    return findHolidayForDate(holidays, date);
  }

  async listByYear(year: number): Promise<Holiday[]> {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    const rows = await this.prisma.holiday.findMany({
      where: {
        deletedAt: null,
        OR: [{ date: { gte: yearStart, lte: yearEnd } }, { isRecurring: true }],
      },
      orderBy: { date: 'asc' },
    });

    return rows.map((r) => this.toEntity(r));
  }

  async create(holiday: Holiday, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.holiday.create({
      data: {
        id: holiday.id,
        name: holiday.name,
        date: holiday.date,
        type: holiday.type,
        description: holiday.description,
        isRecurring: holiday.isRecurring,
        createdAt: holiday.createdAt,
        updatedAt: holiday.updatedAt,
      },
    });
  }

  async update(holiday: Holiday, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.holiday.update({
      where: { id: holiday.id },
      data: {
        name: holiday.name,
        date: holiday.date,
        type: holiday.type,
        description: holiday.description,
        isRecurring: holiday.isRecurring,
        updatedAt: holiday.updatedAt,
        deletedAt: holiday.deletedAt,
      },
    });
  }
}
