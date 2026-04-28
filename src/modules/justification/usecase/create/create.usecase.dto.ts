import { IsOptional, IsUUID, IsUrl, Length } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { JustificationDto } from '../../facade/justification.facade.dto';

export class CreateJustificationUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsUUID('4', { message: 'workDayId inválido' })
  workDayId: string;

  @IsUUID('4', { message: 'createdBy inválido' })
  createdBy: string;

  @Length(3, 1000, {
    message: 'A descrição deve ter entre 3 e 1000 caracteres',
  })
  description: string;

  @IsUrl({ require_tld: false }, { message: 'attachmentUrl inválido' })
  @IsOptional()
  attachmentUrl?: string;
}

export type CreateJustificationUseCaseOutputDto = JustificationDto;

export interface CreateJustificationUseCaseInterface extends BaseUseCase<
  CreateJustificationUseCaseInputDto,
  CreateJustificationUseCaseOutputDto
> {
  execute(
    data: CreateJustificationUseCaseInputDto,
  ): Promise<CreateJustificationUseCaseOutputDto>;
}
