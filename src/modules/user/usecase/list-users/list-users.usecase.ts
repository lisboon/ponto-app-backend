import { UserGateway } from '../../gateway/user.gateway';
import {
  ListUsersUseCaseInputDto,
  ListUsersUseCaseInterface,
  ListUsersUseCaseOutputDto,
} from './list-users.usecase.dto';

export default class ListUsersUseCase implements ListUsersUseCaseInterface {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(
    data: ListUsersUseCaseInputDto,
  ): Promise<ListUsersUseCaseOutputDto> {
    const result = await this.userGateway.search({
      filter: {
        name: data.name,
        email: data.email,
        role: data.role,
        active: data.active,
      },
      sort: data.sort,
      sortDir: data.sortDir,
      page: data.page,
      perPage: data.perPage,
    });

    return {
      items: result.items.map((u) => u.toJSON()),
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      lastPage: result.lastPage,
    };
  }
}
