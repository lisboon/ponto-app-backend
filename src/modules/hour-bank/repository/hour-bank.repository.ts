import type {
  HourBank as PrismaHourBankRow,
  PrismaClient,
} from '@prisma/client';
import { HourBankGateway } from '../gateway/hour-bank.gateway';
import { HourBank } from '../domain/hour-bank.entity';
import { DayStatus } from '@/modules/@shared/domain/enums';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';

export default class HourBankRepository implements HourBankGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntity(row: PrismaHourBankRow): HourBank {
    return new HourBank({
      id: row.id,
      userId: row.userId,
      balanceMinutes: row.balanceMinutes,
      lastRecalculatedAt: row.lastRecalculatedAt ?? undefined,
      updatedAt: row.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<HourBank | null> {
    const row = await this.prisma.hourBank.findUnique({ where: { userId } });
    return row ? this.toEntity(row) : null;
  }

  async upsert(hb: HourBank, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.hourBank.upsert({
      where: { userId: hb.userId },
      create: {
        id: hb.id,
        userId: hb.userId,
        balanceMinutes: hb.balanceMinutes,
        lastRecalculatedAt: hb.lastRecalculatedAt,
      },
      update: {
        balanceMinutes: hb.balanceMinutes,
        lastRecalculatedAt: hb.lastRecalculatedAt,
      },
    });
  }

  async sumClosedDeltaForUser(userId: string): Promise<number> {
    const result = await this.prisma.workDay.aggregate({
      where: { userId, status: DayStatus.CLOSED },
      _sum: { hourBankDelta: true },
    });
    return result._sum.hourBankDelta ?? 0;
  }
}
