import { JustificationGateway } from '../../gateway/justification.gateway';
import { Justification } from '../../domain/justification.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { JustificationDto } from '../../facade/justification.facade.dto';
import {
  UpdateJustificationUseCaseInputDto,
  UpdateJustificationUseCaseInterface,
} from './update.usecase.dto';

export default class UpdateJustificationUseCase implements UpdateJustificationUseCaseInterface {
  constructor(private readonly gateway: JustificationGateway) {}

  async execute(
    data: UpdateJustificationUseCaseInputDto,
  ): Promise<JustificationDto> {
    const j = await this.gateway.findById(data.id);
    if (!j) throw new NotFoundError(data.id, Justification);

    j.updateContent({
      description: data.description,
      attachmentUrl: data.attachmentUrl,
    });
    await this.gateway.update(j);
    return j.toJSON() as JustificationDto;
  }
}
