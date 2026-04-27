import PrismaQueryBuilder from '@/modules/@shared/repository/prisma-query-builder';

export default class UserQueryBuilder extends PrismaQueryBuilder {
  subItems = {};
  whereFields: string[] = ['role', 'active'];
  inFields: string[] = [];
  orFields: string[] = [];
  searchFields: string[] = ['name', 'email'];
  sortableFields: string[] = [
    'name',
    'email',
    'role',
    'createdAt',
    'updatedAt',
  ];
  relationFields: string[] = [];
  relationFilter = undefined;
  include = undefined;
}
