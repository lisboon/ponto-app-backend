import prisma from '@/infra/database/prisma.instance';
import { timeClockEventDispatcher } from '@/modules/time-clock/factory/facade.factory';
import HourBankRepository from '../repository/hour-bank.repository';
import ApplyDeltaUseCase from '../usecase/apply-delta/apply-delta.usecase';
import RecalculateByUserUseCase from '../usecase/recalculate-by-user/recalculate-by-user.usecase';
import FindByUserUseCase from '../usecase/find-by-user/find-by-user.usecase';
import { WorkDayClosedHandler } from '../event/handlers/work-day-closed.handler';
import HourBankFacade from '../facade/hour-bank.facade';

function registerHandlers(repository: HourBankRepository): void {
  const applyDelta = new ApplyDeltaUseCase(repository);
  timeClockEventDispatcher.register(
    'WorkDayClosedEvent',
    new WorkDayClosedHandler(applyDelta),
  );
}

let initialized = false;

export default class HourBankFacadeFactory {
  static create(): HourBankFacade {
    const repository = new HourBankRepository(prisma);

    if (!initialized) {
      registerHandlers(repository);
      initialized = true;
    }

    const findByUserUseCase = new FindByUserUseCase(repository);
    const recalculateUseCase = new RecalculateByUserUseCase(repository);

    return new HourBankFacade(findByUserUseCase, recalculateUseCase);
  }
}
