import { IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { HourBankDto } from '../../facade/hour-bank.facade.dto';

export class RecalculateByUserUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;
}

export type RecalculateByUserUseCaseOutputDto = HourBankDto;

export interface RecalculateByUserUseCaseInterface extends BaseUseCase<
  RecalculateByUserUseCaseInputDto,
  RecalculateByUserUseCaseOutputDto
> {
  execute(
    data: RecalculateByUserUseCaseInputDto,
  ): Promise<RecalculateByUserUseCaseOutputDto>;
}
