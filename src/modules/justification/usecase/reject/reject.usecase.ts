import { JustificationGateway } from '../../gateway/justification.gateway';
import { Justification } from '../../domain/justification.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { EventDispatcherInterface } from '@/modules/@shared/domain/events/event-dispatcher.interface';
import { JustificationDto } from '../../facade/justification.facade.dto';
import {
  RejectJustificationUseCaseInputDto,
  RejectJustificationUseCaseInterface,
} from './reject.usecase.dto';

export default class RejectJustificationUseCase implements RejectJustificationUseCaseInterface {
  constructor(
    private readonly gateway: JustificationGateway,
    private readonly eventDispatcher: EventDispatcherInterface,
  ) {}

  async execute(
    data: RejectJustificationUseCaseInputDto,
  ): Promise<JustificationDto> {
    const j = await this.gateway.findById(data.id);
    if (!j) throw new NotFoundError(data.id, Justification);

    j.reject(data.reviewerId, data.reviewNote);
    await this.gateway.update(j);

    for (const event of j.pullEvents()) {
      await this.eventDispatcher.dispatch(event);
    }

    return j.toJSON() as JustificationDto;
  }
}
