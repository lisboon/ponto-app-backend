import { MedicalLeaveGateway } from '../../gateway/medical-leave.gateway';
import { MedicalLeave } from '../../domain/medical-leave.entity';
import { TimeClockGateway } from '@/modules/time-clock/gateway/time-clock.gateway';
import { UserGateway } from '@/modules/user/gateway/user.gateway';
import { WorkScheduleGateway } from '@/modules/work-schedule/gateway/work-schedule.gateway';
import { HolidayGateway } from '@/modules/holiday/gateway/holiday.gateway';
import { TransactionManager } from '@/modules/@shared/domain/transaction/transaction-manager.interface';
import { EventDispatcherInterface } from '@/modules/@shared/domain/events/event-dispatcher.interface';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { resolveExpectedMinutes } from '@/modules/time-clock/usecase/_shared/resolve-expected-minutes';
import { MedicalLeaveDto } from '../../facade/medical-leave.facade.dto';
import {
  RevokeMedicalLeaveUseCaseInputDto,
  RevokeMedicalLeaveUseCaseInterface,
} from './revoke.usecase.dto';

export default class RevokeMedicalLeaveUseCase implements RevokeMedicalLeaveUseCaseInterface {
  constructor(
    private readonly mlGateway: MedicalLeaveGateway,
    private readonly timeClockGateway: TimeClockGateway,
    private readonly userGateway: UserGateway,
    private readonly workScheduleGateway: WorkScheduleGateway,
    private readonly holidayGateway: HolidayGateway,
    private readonly transactionManager: TransactionManager,
    private readonly eventDispatcher: EventDispatcherInterface,
  ) {}

  async execute(
    data: RevokeMedicalLeaveUseCaseInputDto,
  ): Promise<MedicalLeaveDto> {
    const ml = await this.mlGateway.findById(data.id);
    if (!ml) throw new NotFoundError(data.id, MedicalLeave);

    ml.revoke(data.revokedBy);

    await this.transactionManager.execute(async (trx) => {
      await this.mlGateway.update(ml, trx);
      for (const date of ml.affectedDays()) {
        const day = await this.timeClockGateway.findDay(ml.userId, date);
        if (!day || day.medicalLeaveId !== ml.id) continue;

        const { expectedMinutes } = await resolveExpectedMinutes(
          ml.userId,
          date,
          this.userGateway,
          this.workScheduleGateway,
          this.holidayGateway,
        );
        day.unmarkMedicalLeave(expectedMinutes);
        await this.timeClockGateway.saveDay(day, trx);
      }
    });

    for (const event of ml.pullEvents()) {
      await this.eventDispatcher.dispatch(event);
    }

    return ml.toJSON() as MedicalLeaveDto;
  }
}
