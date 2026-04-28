import { TimeClockGateway } from '../../gateway/time-clock.gateway';
import { WorkDayDto } from '../../facade/time-clock.facade.dto';
import {
  ListHistoryUseCaseInputDto,
  ListHistoryUseCaseInterface,
  ListHistoryUseCaseOutputDto,
} from './list-history.usecase.dto';

export default class ListHistoryUseCase implements ListHistoryUseCaseInterface {
  constructor(private readonly gateway: TimeClockGateway) {}

  async execute(
    data: ListHistoryUseCaseInputDto,
  ): Promise<ListHistoryUseCaseOutputDto> {
    const result = await this.gateway.searchHistory({
      filter: {
        userId: data.userId,
        status: data.status,
        fromDate: data.fromDate ? new Date(data.fromDate) : undefined,
        toDate: data.toDate ? new Date(data.toDate) : undefined,
      },
      page: data.page,
      perPage: data.perPage,
    });

    return {
      items: result.items.map((d) => d.toJSON() as WorkDayDto),
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      lastPage: result.lastPage,
    };
  }
}
