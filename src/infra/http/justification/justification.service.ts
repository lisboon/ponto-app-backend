import { Inject, Injectable } from '@nestjs/common';
import JustificationFacade from '@/modules/justification/facade/justification.facade';
import {
  ApproveJustificationFacadeInputDto,
  CreateJustificationFacadeInputDto,
  FindByIdJustificationFacadeInputDto,
  ListJustificationsFacadeInputDto,
  RejectJustificationFacadeInputDto,
  UpdateJustificationFacadeInputDto,
} from '@/modules/justification/facade/justification.facade.dto';

@Injectable()
export class JustificationService {
  @Inject(JustificationFacade)
  private readonly facade: JustificationFacade;

  create(input: CreateJustificationFacadeInputDto) {
    return this.facade.create(input);
  }

  findById(input: FindByIdJustificationFacadeInputDto) {
    return this.facade.findById(input);
  }

  update(input: UpdateJustificationFacadeInputDto) {
    return this.facade.update(input);
  }

  approve(input: ApproveJustificationFacadeInputDto) {
    return this.facade.approve(input);
  }

  reject(input: RejectJustificationFacadeInputDto) {
    return this.facade.reject(input);
  }

  list(input: ListJustificationsFacadeInputDto) {
    return this.facade.list(input);
  }
}
