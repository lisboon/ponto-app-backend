import { IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';

export class PublishUseCaseInputDto {
  @IsUUID('4', { message: 'id inválido' })
  id: string;
}

export type PublishUseCaseOutputDto = AnnouncementDto;

export interface PublishUseCaseInterface extends BaseUseCase<
  PublishUseCaseInputDto,
  PublishUseCaseOutputDto
> {
  execute(data: PublishUseCaseInputDto): Promise<PublishUseCaseOutputDto>;
}
