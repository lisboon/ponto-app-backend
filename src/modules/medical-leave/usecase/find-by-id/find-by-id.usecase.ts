import { MedicalLeaveGateway } from '../../gateway/medical-leave.gateway';
import { MedicalLeave } from '../../domain/medical-leave.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  FindByIdMedicalLeaveUseCaseInputDto,
  FindByIdMedicalLeaveUseCaseInterface,
} from './find-by-id.usecase.dto';

export default class FindByIdMedicalLeaveUseCase implements FindByIdMedicalLeaveUseCaseInterface {
  constructor(private readonly gateway: MedicalLeaveGateway) {}

  async execute(
    data: FindByIdMedicalLeaveUseCaseInputDto,
  ): Promise<MedicalLeave> {
    const ml = await this.gateway.findById(data.id);
    if (!ml) throw new NotFoundError(data.id, MedicalLeave);
    return ml;
  }
}
