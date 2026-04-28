import { IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export class MarkReadUseCaseInputDto {
  @IsUUID('4', { message: 'announcementId inválido' })
  announcementId: string;

  @IsUUID('4', { message: 'userId inválido' })
  userId: string;
}

export interface MarkReadUseCaseOutputDto {
  ok: true;
}

export interface MarkReadUseCaseInterface extends BaseUseCase<
  MarkReadUseCaseInputDto,
  MarkReadUseCaseOutputDto
> {
  execute(data: MarkReadUseCaseInputDto): Promise<MarkReadUseCaseOutputDto>;
}
