import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { MedicalLeave } from '../../domain/medical-leave.entity';

export interface FindByIdMedicalLeaveUseCaseInputDto {
  id: string;
}

export interface FindByIdMedicalLeaveUseCaseInterface extends BaseUseCase<
  FindByIdMedicalLeaveUseCaseInputDto,
  MedicalLeave
> {
  execute(data: FindByIdMedicalLeaveUseCaseInputDto): Promise<MedicalLeave>;
}
