import { IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { HourBankDto } from '../../facade/hour-bank.facade.dto';

export class FindByUserUseCaseInputDto {
  @IsUUID('4', { message: 'userId inválido' })
  userId: string;
}

export type FindByUserUseCaseOutputDto = HourBankDto | null;

export interface FindByUserUseCaseInterface extends BaseUseCase<
  FindByUserUseCaseInputDto,
  FindByUserUseCaseOutputDto
> {
  execute(data: FindByUserUseCaseInputDto): Promise<FindByUserUseCaseOutputDto>;
}
