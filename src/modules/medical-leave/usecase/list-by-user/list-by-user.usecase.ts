import { MedicalLeaveGateway } from '../../gateway/medical-leave.gateway';
import { MedicalLeaveDto } from '../../facade/medical-leave.facade.dto';
import {
  ListByUserMedicalLeaveUseCaseInputDto,
  ListByUserMedicalLeaveUseCaseInterface,
  ListByUserMedicalLeaveUseCaseOutputDto,
} from './list-by-user.usecase.dto';

export default class ListByUserMedicalLeaveUseCase implements ListByUserMedicalLeaveUseCaseInterface {
  constructor(private readonly gateway: MedicalLeaveGateway) {}

  async execute(
    data: ListByUserMedicalLeaveUseCaseInputDto,
  ): Promise<ListByUserMedicalLeaveUseCaseOutputDto> {
    const items = await this.gateway.listByUser({
      userId: data.userId,
      activeOnly: data.activeOnly,
    });
    return {
      items: items.map((ml) => ml.toJSON() as MedicalLeaveDto),
    };
  }
}
