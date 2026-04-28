import { JustificationGateway } from '../../gateway/justification.gateway';
import { Justification } from '../../domain/justification.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  FindByIdJustificationUseCaseInputDto,
  FindByIdJustificationUseCaseInterface,
} from './find-by-id.usecase.dto';

export default class FindByIdJustificationUseCase implements FindByIdJustificationUseCaseInterface {
  constructor(private readonly gateway: JustificationGateway) {}

  async execute(
    data: FindByIdJustificationUseCaseInputDto,
  ): Promise<Justification> {
    const j = await this.gateway.findById(data.id);
    if (!j) throw new NotFoundError(data.id, Justification);
    return j;
  }
}
