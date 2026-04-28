import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { AnnouncementStatus } from '@/modules/@shared/domain/enums';
import { AnnouncementDto } from '../../facade/announcement.facade.dto';

export class ListAnnouncementsUseCaseInputDto {
  @IsEnum(AnnouncementStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: AnnouncementStatus;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  perPage?: number;
}

export interface ListAnnouncementsUseCaseOutputDto {
  items: AnnouncementDto[];
}

export interface ListAnnouncementsUseCaseInterface extends BaseUseCase<
  ListAnnouncementsUseCaseInputDto,
  ListAnnouncementsUseCaseOutputDto
> {
  execute(
    data: ListAnnouncementsUseCaseInputDto,
  ): Promise<ListAnnouncementsUseCaseOutputDto>;
}
