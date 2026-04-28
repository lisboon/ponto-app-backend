import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { PunchFacadeOutputDto } from '../../facade/time-clock.facade.dto';

export class PunchUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsString({ message: 'ipAddress inválido' })
  @IsOptional()
  ipAddress?: string;

  @IsString({ message: 'userAgent inválido' })
  @IsOptional()
  userAgent?: string;

  @IsBoolean({ message: 'outsideStudio inválido' })
  outsideStudio: boolean;
}

export type PunchUseCaseOutputDto = PunchFacadeOutputDto;

export interface PunchUseCaseInterface extends BaseUseCase<
  PunchUseCaseInputDto,
  PunchUseCaseOutputDto
> {
  execute(data: PunchUseCaseInputDto): Promise<PunchUseCaseOutputDto>;
}
