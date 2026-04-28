import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { MedicalLeaveDto } from '../../facade/medical-leave.facade.dto';

export class CreateMedicalLeaveUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsUUID('4', { message: 'createdBy inválido' })
  createdBy: string;

  @IsDateString({}, { message: 'startDate inválido (esperado ISO yyyy-mm-dd)' })
  startDate: string;

  @IsDateString({}, { message: 'endDate inválido (esperado ISO yyyy-mm-dd)' })
  endDate: string;

  @IsNotEmpty({ message: 'attachmentUrl é obrigatório' })
  attachmentUrl: string;

  @Length(0, 1000, {
    message: 'A justificativa não pode exceder 1000 caracteres',
  })
  @IsOptional()
  reason?: string;
}

export type CreateMedicalLeaveUseCaseOutputDto = MedicalLeaveDto;

export interface CreateMedicalLeaveUseCaseInterface extends BaseUseCase<
  CreateMedicalLeaveUseCaseInputDto,
  CreateMedicalLeaveUseCaseOutputDto
> {
  execute(
    data: CreateMedicalLeaveUseCaseInputDto,
  ): Promise<CreateMedicalLeaveUseCaseOutputDto>;
}
