import { IsUUID, Length } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { JustificationDto } from '../../facade/justification.facade.dto';

export class RejectJustificationUseCaseInputDto {
  id: string;

  @IsUUID('4', { message: 'reviewerId inválido' })
  reviewerId: string;

  @Length(3, 500, {
    message: 'A nota de rejeição deve ter entre 3 e 500 caracteres',
  })
  reviewNote: string;
}

export type RejectJustificationUseCaseOutputDto = JustificationDto;

export interface RejectJustificationUseCaseInterface extends BaseUseCase<
  RejectJustificationUseCaseInputDto,
  RejectJustificationUseCaseOutputDto
> {
  execute(
    data: RejectJustificationUseCaseInputDto,
  ): Promise<RejectJustificationUseCaseOutputDto>;
}
