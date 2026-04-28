import { IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { MedicalLeaveDto } from '../../facade/medical-leave.facade.dto';

export class RevokeMedicalLeaveUseCaseInputDto {
  id: string;

  @IsUUID('4', { message: 'revokedBy inválido' })
  revokedBy: string;
}

export type RevokeMedicalLeaveUseCaseOutputDto = MedicalLeaveDto;

export interface RevokeMedicalLeaveUseCaseInterface extends BaseUseCase<
  RevokeMedicalLeaveUseCaseInputDto,
  RevokeMedicalLeaveUseCaseOutputDto
> {
  execute(
    data: RevokeMedicalLeaveUseCaseInputDto,
  ): Promise<RevokeMedicalLeaveUseCaseOutputDto>;
}
