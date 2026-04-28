import { IsOptional, IsUrl, Length } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { JustificationDto } from '../../facade/justification.facade.dto';

export class UpdateJustificationUseCaseInputDto {
  id: string;

  @Length(3, 1000, {
    message: 'A descrição deve ter entre 3 e 1000 caracteres',
  })
  @IsOptional()
  description?: string;

  @IsUrl({ require_tld: false }, { message: 'attachmentUrl inválido' })
  @IsOptional()
  attachmentUrl?: string;
}

export type UpdateJustificationUseCaseOutputDto = JustificationDto;

export interface UpdateJustificationUseCaseInterface extends BaseUseCase<
  UpdateJustificationUseCaseInputDto,
  UpdateJustificationUseCaseOutputDto
> {
  execute(
    data: UpdateJustificationUseCaseInputDto,
  ): Promise<UpdateJustificationUseCaseOutputDto>;
}
