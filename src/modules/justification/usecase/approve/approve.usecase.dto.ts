import { IsOptional, IsUUID, Length } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { JustificationDto } from '../../facade/justification.facade.dto';

export class ApproveJustificationUseCaseInputDto {
  id: string;

  @IsUUID('4', { message: 'reviewerId inválido' })
  reviewerId: string;

  @Length(0, 500, { message: 'A nota não pode exceder 500 caracteres' })
  @IsOptional()
  reviewNote?: string;
}

export type ApproveJustificationUseCaseOutputDto = JustificationDto;

export interface ApproveJustificationUseCaseInterface extends BaseUseCase<
  ApproveJustificationUseCaseInputDto,
  ApproveJustificationUseCaseOutputDto
> {
  execute(
    data: ApproveJustificationUseCaseInputDto,
  ): Promise<ApproveJustificationUseCaseOutputDto>;
}
