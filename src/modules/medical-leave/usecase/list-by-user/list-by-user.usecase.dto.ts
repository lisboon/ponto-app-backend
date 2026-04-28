import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { MedicalLeaveDto } from '../../facade/medical-leave.facade.dto';

export class ListByUserMedicalLeaveUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean({ message: 'activeOnly inválido' })
  @IsOptional()
  activeOnly?: boolean;
}

export interface ListByUserMedicalLeaveUseCaseOutputDto {
  items: MedicalLeaveDto[];
}

export interface ListByUserMedicalLeaveUseCaseInterface extends BaseUseCase<
  ListByUserMedicalLeaveUseCaseInputDto,
  ListByUserMedicalLeaveUseCaseOutputDto
> {
  execute(
    data: ListByUserMedicalLeaveUseCaseInputDto,
  ): Promise<ListByUserMedicalLeaveUseCaseOutputDto>;
}
