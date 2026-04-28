import { JustificationGateway } from '../../gateway/justification.gateway';
import { JustificationDto } from '../../facade/justification.facade.dto';
import {
  ListJustificationsUseCaseInputDto,
  ListJustificationsUseCaseInterface,
  ListJustificationsUseCaseOutputDto,
} from './list.usecase.dto';

export default class ListJustificationsUseCase implements ListJustificationsUseCaseInterface {
  constructor(private readonly gateway: JustificationGateway) {}

  async execute(
    data: ListJustificationsUseCaseInputDto,
  ): Promise<ListJustificationsUseCaseOutputDto> {
    const result = await this.gateway.search({
      filter: {
        userId: data.userId,
        workDayId: data.workDayId,
        status: data.status,
      },
      sort: data.sort,
      sortDir: data.sortDir,
      page: data.page,
      perPage: data.perPage,
    });

    return {
      items: result.items.map((j) => j.toJSON() as JustificationDto),
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      lastPage: result.lastPage,
    };
  }
}
