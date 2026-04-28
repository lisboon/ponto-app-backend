import { JustificationGateway } from '../../gateway/justification.gateway';
import { Justification } from '../../domain/justification.entity';
import { JustificationDto } from '../../facade/justification.facade.dto';
import {
  CreateJustificationUseCaseInputDto,
  CreateJustificationUseCaseInterface,
} from './create.usecase.dto';

export default class CreateJustificationUseCase implements CreateJustificationUseCaseInterface {
  constructor(private readonly gateway: JustificationGateway) {}

  async execute(
    data: CreateJustificationUseCaseInputDto,
  ): Promise<JustificationDto> {
    const j = Justification.create({
      userId: data.userId,
      workDayId: data.workDayId,
      createdBy: data.createdBy,
      description: data.description,
      attachmentUrl: data.attachmentUrl,
    });
    await this.gateway.create(j);
    return j.toJSON() as JustificationDto;
  }
}
