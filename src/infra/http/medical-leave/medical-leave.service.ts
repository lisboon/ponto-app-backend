import { Inject, Injectable } from '@nestjs/common';
import MedicalLeaveFacade from '@/modules/medical-leave/facade/medical-leave.facade';
import {
  CreateMedicalLeaveFacadeInputDto,
  FindByIdMedicalLeaveFacadeInputDto,
  ListByUserMedicalLeaveFacadeInputDto,
  RevokeMedicalLeaveFacadeInputDto,
} from '@/modules/medical-leave/facade/medical-leave.facade.dto';

@Injectable()
export class MedicalLeaveService {
  @Inject(MedicalLeaveFacade)
  private readonly facade: MedicalLeaveFacade;

  create(input: CreateMedicalLeaveFacadeInputDto) {
    return this.facade.create(input);
  }

  findById(input: FindByIdMedicalLeaveFacadeInputDto) {
    return this.facade.findById(input);
  }

  listByUser(input: ListByUserMedicalLeaveFacadeInputDto) {
    return this.facade.listByUser(input);
  }

  revoke(input: RevokeMedicalLeaveFacadeInputDto) {
    return this.facade.revoke(input);
  }
}
