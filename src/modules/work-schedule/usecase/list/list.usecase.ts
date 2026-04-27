import { WorkScheduleGateway } from '../../gateway/work-schedule.gateway';
import {
  ListWorkSchedulesUseCaseInputDto,
  ListWorkSchedulesUseCaseInterface,
  ListWorkSchedulesUseCaseOutputDto,
} from './list.usecase.dto';

export default class ListWorkSchedulesUseCase implements ListWorkSchedulesUseCaseInterface {
  constructor(private readonly gateway: WorkScheduleGateway) {}

  async execute(
    data: ListWorkSchedulesUseCaseInputDto,
  ): Promise<ListWorkSchedulesUseCaseOutputDto> {
    const result = await this.gateway.search({
      filter: { name: data.name, active: data.active },
      sort: data.sort,
      sortDir: data.sortDir,
      page: data.page,
      perPage: data.perPage,
    });

    return {
      items: result.items.map((s) => s.toJSON()),
      total: result.total,
      currentPage: result.currentPage,
      perPage: result.perPage,
      lastPage: result.lastPage,
    };
  }
}
