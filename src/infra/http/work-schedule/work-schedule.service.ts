import { Inject, Injectable } from '@nestjs/common';
import WorkScheduleFacade from '@/modules/work-schedule/facade/work-schedule.facade';
import {
  CreateWorkScheduleFacadeInputDto,
  DeleteWorkScheduleFacadeInputDto,
  FindByIdWorkScheduleFacadeInputDto,
  ListWorkSchedulesFacadeInputDto,
  UpdateWorkScheduleFacadeInputDto,
} from '@/modules/work-schedule/facade/work-schedule.facade.dto';

@Injectable()
export class WorkScheduleService {
  @Inject(WorkScheduleFacade)
  private readonly facade: WorkScheduleFacade;

  create(input: CreateWorkScheduleFacadeInputDto) {
    return this.facade.create(input);
  }

  findById(input: FindByIdWorkScheduleFacadeInputDto) {
    return this.facade.findById(input);
  }

  update(input: UpdateWorkScheduleFacadeInputDto) {
    return this.facade.update(input);
  }

  delete(input: DeleteWorkScheduleFacadeInputDto) {
    return this.facade.delete(input);
  }

  list(input: ListWorkSchedulesFacadeInputDto) {
    return this.facade.list(input);
  }
}
