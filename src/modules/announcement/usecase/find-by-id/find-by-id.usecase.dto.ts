import { IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';

export class FindByIdAnnouncementUseCaseInputDto {
  @IsUUID('4', { message: 'id inválido' })
  id: string;
}

export type FindByIdAnnouncementUseCaseOutputDto = AnnouncementDto;

export interface FindByIdAnnouncementUseCaseInterface extends BaseUseCase<
  FindByIdAnnouncementUseCaseInputDto,
  FindByIdAnnouncementUseCaseOutputDto
> {
  execute(
    data: FindByIdAnnouncementUseCaseInputDto,
  ): Promise<FindByIdAnnouncementUseCaseOutputDto>;
}
