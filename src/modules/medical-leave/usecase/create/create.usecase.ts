import { MedicalLeaveGateway } from '../../gateway/medical-leave.gateway';
import { MedicalLeave } from '../../domain/medical-leave.entity';
import { TimeClockGateway } from '@/modules/time-clock/gateway/time-clock.gateway';
import { WorkDay } from '@/modules/time-clock/domain/work-day.entity';
import { TransactionManager } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { EventDispatcherInterface } from '@/modules/@shared/domain/events/event-dispatcher.interface';
import { dayKey } from '@/modules/time-clock/usecase/_shared/get-or-create-day';
import { MedicalLeaveDto } from '../../facade/medical-leave.facade.dto';
import {
  CreateMedicalLeaveUseCaseInputDto,
  CreateMedicalLeaveUseCaseInterface,
} from './create.usecase.dto';

export default class CreateMedicalLeaveUseCase implements CreateMedicalLeaveUseCaseInterface {
  constructor(
    private readonly mlGateway: MedicalLeaveGateway,
    private readonly timeClockGateway: TimeClockGateway,
    private readonly transactionManager: TransactionManager,
    private readonly eventDispatcher: EventDispatcherInterface,
  ) {}

  async execute(
    data: CreateMedicalLeaveUseCaseInputDto,
  ): Promise<MedicalLeaveDto> {
    const startDate = dayKey(new Date(data.startDate));
    const endDate = dayKey(new Date(data.endDate));

    const ml = MedicalLeave.create({
      userId: data.userId,
      createdBy: data.createdBy,
      startDate,
      endDate,
      attachmentUrl: data.attachmentUrl,
      reason: data.reason,
    });

    await this.transactionManager.execute(async (trx) => {
      await this.mlGateway.create(ml, trx);
      for (const day of ml.affectedDays()) {
        const existing = await this.timeClockGateway.findDay(ml.userId, day);
        const wd =
          existing ??
          WorkDay.create({
            userId: ml.userId,
            date: day,
            expectedMinutes: 0,
          });
        wd.markMedicalLeave(ml.id);
        await this.timeClockGateway.saveDay(wd, trx);
      }
    });

    ml.emitCreatedEvent();
    for (const event of ml.pullEvents()) {
      await this.eventDispatcher.dispatch(event);
    }

    return ml.toJSON() as MedicalLeaveDto;
  }
}
