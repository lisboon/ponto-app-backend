import PrismaQueryBuilder from '@/modules/@shared/repository/prisma-query-builder';

export default class WorkScheduleQueryBuilder extends PrismaQueryBuilder {
  subItems = {};
  whereFields: string[] = ['active'];
  inFields: string[] = [];
  orFields: string[] = [];
  searchFields: string[] = ['name'];
  sortableFields: string[] = ['name', 'createdAt', 'updatedAt'];
  relationFields: string[] = [];
  relationFilter = undefined;
  include = undefined;
}
