import type {
  MedicalLeave as PrismaMedicalLeaveRow,
  PrismaClient,
} from '@prisma/client';
import { MedicalLeaveGateway } from '../gateway/medical-leave.gateway';
import { MedicalLeaveFilter } from '../gateway/medical-leave.filter';
import { MedicalLeave } from '../domain/medical-leave.entity';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';

export default class MedicalLeaveRepository implements MedicalLeaveGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntity(row: PrismaMedicalLeaveRow): MedicalLeave {
    return new MedicalLeave({
      id: row.id,
      userId: row.userId,
      startDate: row.startDate,
      endDate: row.endDate,
      attachmentUrl: row.attachmentUrl,
      reason: row.reason ?? undefined,
      createdBy: row.createdBy,
      revokedAt: row.revokedAt ?? undefined,
      revokedBy: row.revokedBy ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string): Promise<MedicalLeave | null> {
    const row = await this.prisma.medicalLeave.findFirst({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async listByUser(filter: MedicalLeaveFilter): Promise<MedicalLeave[]> {
    const where: Record<string, unknown> = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.activeOnly) where.revokedAt = null;

    const rows = await this.prisma.medicalLeave.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async create(ml: MedicalLeave, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.medicalLeave.create({
      data: {
        id: ml.id,
        userId: ml.userId,
        startDate: ml.startDate,
        endDate: ml.endDate,
        attachmentUrl: ml.attachmentUrl,
        reason: ml.reason,
        createdBy: ml.createdBy,
        revokedAt: ml.revokedAt,
        revokedBy: ml.revokedBy,
        createdAt: ml.createdAt,
        updatedAt: ml.updatedAt,
      },
    });
  }

  async update(ml: MedicalLeave, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.medicalLeave.update({
      where: { id: ml.id },
      data: {
        revokedAt: ml.revokedAt,
        revokedBy: ml.revokedBy,
        reason: ml.reason,
        updatedAt: ml.updatedAt,
      },
    });
  }
}
