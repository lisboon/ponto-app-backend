import ListUsersUseCase from '../../../usecase/list-users/list-users.usecase';
import { User } from '../../../domain/user.entity';
import { SearchResult } from '@/modules/@shared/repository/search-result';
import { UserRole } from '@/modules/@shared/domain/enums';

const validUser = (email: string) =>
  User.create({
    email,
    name: 'Tester',
    password: 'hashed',
    role: UserRole.EMPLOYEE,
  });

describe('ListUsersUseCase', () => {
  it('encaminha filtros para o gateway e retorna paginação', async () => {
    const items = [validUser('a@s.local'), validUser('b@s.local')];
    const userGateway = {
      search: jest.fn().mockResolvedValue(
        new SearchResult({
          items,
          total: 2,
          currentPage: 1,
          perPage: 20,
        }),
      ),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    const useCase = new ListUsersUseCase(userGateway);

    const out = await useCase.execute({
      name: 'X',
      role: UserRole.EMPLOYEE,
      active: true,
      page: 1,
      perPage: 20,
    });

    expect(userGateway.search).toHaveBeenCalledWith({
      filter: {
        name: 'X',
        email: undefined,
        role: UserRole.EMPLOYEE,
        active: true,
      },
      sort: undefined,
      sortDir: undefined,
      page: 1,
      perPage: 20,
    });
    expect(out.items).toHaveLength(2);
    expect(out.total).toBe(2);
    expect(out.currentPage).toBe(1);
    expect(out.lastPage).toBe(1);
  });
});
