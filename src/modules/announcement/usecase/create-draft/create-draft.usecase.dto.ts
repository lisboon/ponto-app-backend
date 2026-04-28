import { IsString, IsUUID, Length } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';

export class CreateDraftUseCaseInputDto {
  @IsUUID('4', { message: 'authorId inválido' })
  authorId: string;

  @IsString()
  @Length(3, 200, { message: 'Título deve ter entre 3 e 200 caracteres' })
  title: string;

  @IsString()
  @Length(1, 10000, { message: 'Conteúdo inválido' })
  content: string;
}

export type CreateDraftUseCaseOutputDto = AnnouncementDto;

export interface CreateDraftUseCaseInterface extends BaseUseCase<
  CreateDraftUseCaseInputDto,
  CreateDraftUseCaseOutputDto
> {
  execute(
    data: CreateDraftUseCaseInputDto,
  ): Promise<CreateDraftUseCaseOutputDto>;
}
