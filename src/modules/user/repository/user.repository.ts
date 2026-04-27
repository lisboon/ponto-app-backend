import type { User as PrismaUserRow, PrismaClient } from '@prisma/client';
import { UserGateway } from '../gateway/user.gateway';
import { User } from '../domain/user.entity';
import { ContractType, UserRole } from '@/modules/@shared/domain/enums';
import { TransactionContext } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { normalizeEmail } from '@/modules/@shared/domain/utils/email';
import { SearchResult } from '@/modules/@shared/repository/search-result';
import { SearchParams } from '@/modules/@shared/repository/search-params';
import { UserSearchParams } from '../gateway/user.filter';
import UserQueryBuilder from './user.query.builder';

export default class UserRepository implements UserGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private getClient(trx?: TransactionContext): PrismaClient {
    return (trx as PrismaClient) ?? this.prisma;
  }

  private toEntity(row: PrismaUserRow): User {
    return new User({
      id: row.id,
      email: row.email,
      name: row.name,
      password: row.password,
      avatarUrl: row.avatarUrl ?? undefined,
      role: row.role as UserRole,
      position: row.position ?? undefined,
      contractType: (row.contractType as ContractType | null) ?? undefined,
      weeklyMinutes: row.weeklyMinutes ?? undefined,
      hourlyRate:
        row.hourlyRate !== null && row.hourlyRate !== undefined
          ? Number(row.hourlyRate)
          : undefined,
      workScheduleId: row.workScheduleId ?? undefined,
      hireDate: row.hireDate ?? undefined,
      active: row.active,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt ?? undefined,
    });
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? this.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.prisma.user.findFirst({
      where: { email: normalizeEmail(email), deletedAt: null },
    });
    return row ? this.toEntity(row) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: normalizeEmail(email), deletedAt: null },
    });
    return count > 0;
  }

  async create(user: User, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        avatarUrl: user.avatarUrl,
        role: user.role,
        position: user.position,
        contractType: user.contractType,
        weeklyMinutes: user.weeklyMinutes,
        hourlyRate: user.hourlyRate,
        workScheduleId: user.workScheduleId,
        hireDate: user.hireDate,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async update(user: User, trx?: TransactionContext): Promise<void> {
    const client = this.getClient(trx);
    await client.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        avatarUrl: user.avatarUrl,
        role: user.role,
        position: user.position,
        contractType: user.contractType,
        weeklyMinutes: user.weeklyMinutes,
        hourlyRate: user.hourlyRate,
        workScheduleId: user.workScheduleId,
        hireDate: user.hireDate,
        active: user.active,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    });
  }

  async search(params: UserSearchParams): Promise<SearchResult<User>> {
    const searchParams = new SearchParams({
      filter: params.filter,
      sort: params.sort,
      sortDir: params.sortDir,
      page: params.page,
      perPage: params.perPage,
    });

    const query = new UserQueryBuilder(
      searchParams.filter ?? {},
      { sort: searchParams.sort, sortDir: searchParams.sortDir },
      { page: searchParams.page, perPage: searchParams.perPage },
    ).build();

    const where = { ...query.where, deletedAt: null };

    const [items, count] = await Promise.all([
      this.prisma.user.findMany({ ...query, where }),
      this.prisma.user.count({ where }),
    ]);

    return new SearchResult<User>({
      items: items.map((item) => this.toEntity(item)),
      total: count,
      perPage: searchParams.perPage,
      currentPage: searchParams.page,
    });
  }
}
