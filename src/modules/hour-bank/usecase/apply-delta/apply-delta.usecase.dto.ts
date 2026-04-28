import { IsInt, IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { HourBankDto } from '../../facade/hour-bank.facade.dto';

export class ApplyDeltaUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;

  @IsInt({ message: 'delta deve ser inteiro (minutos)' })
  delta: number;
}

export type ApplyDeltaUseCaseOutputDto = HourBankDto;

export interface ApplyDeltaUseCaseInterface extends BaseUseCase<
  ApplyDeltaUseCaseInputDto,
  ApplyDeltaUseCaseOutputDto
> {
  execute(data: ApplyDeltaUseCaseInputDto): Promise<ApplyDeltaUseCaseOutputDto>;
}
