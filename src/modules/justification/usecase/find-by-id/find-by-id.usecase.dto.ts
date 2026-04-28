import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { Justification } from '../../domain/justification.entity';

export interface FindByIdJustificationUseCaseInputDto {
  id: string;
}

export interface FindByIdJustificationUseCaseInterface extends BaseUseCase<
  FindByIdJustificationUseCaseInputDto,
  Justification
> {
  execute(data: FindByIdJustificationUseCaseInputDto): Promise<Justification>;
}
