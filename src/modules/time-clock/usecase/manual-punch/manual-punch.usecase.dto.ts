import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { PunchType } from '@/modules/@shared/domain/enums';
import { ManualPunchFacadeOutputDto } from '../../facade/time-clock.facade.dto';

export class ManualPunchUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsEnum(PunchType, { message: 'punchType inválido' })
  punchType: PunchType;

  @IsDateString({}, { message: 'punchedAt inválido (ISO yyyy-mm-ddTHH:MM:SS)' })
  punchedAt: string;

  @Length(0, 500, { message: 'A nota manual não pode exceder 500 caracteres' })
  @IsOptional()
  manualNote?: string;
}

export type ManualPunchUseCaseOutputDto = ManualPunchFacadeOutputDto;

export interface ManualPunchUseCaseInterface extends BaseUseCase<
  ManualPunchUseCaseInputDto,
  ManualPunchUseCaseOutputDto
> {
  execute(
    data: ManualPunchUseCaseInputDto,
  ): Promise<ManualPunchUseCaseOutputDto>;
}
