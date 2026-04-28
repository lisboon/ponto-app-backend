import { UserGateway } from '@/modules/user/gateway/user.gateway';
import { WorkScheduleGateway } from '@/modules/work-schedule/gateway/work-schedule.gateway';
import { HolidayGateway } from '@/modules/holiday/gateway/holiday.gateway';
import { Holiday } from '@/modules/holiday/domain/holiday.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { User } from '@/modules/user/domain/user.entity';

export interface ExpectedMinutesContext {
  expectedMinutes: number;
  holiday: Holiday | null;
}

export async function resolveExpectedMinutes(
  userId: string,
  date: Date,
  userGateway: UserGateway,
  workScheduleGateway: WorkScheduleGateway,
  holidayGateway: HolidayGateway,
): Promise<ExpectedMinutesContext> {
  const user = await userGateway.findById(userId);
  if (!user) {
    throw new NotFoundError(userId, User);
  }

  const holiday = await holidayGateway.findByDate(date);
  if (holiday) {
    return { expectedMinutes: 0, holiday };
  }

  if (!user.workScheduleId) {
    return { expectedMinutes: 0, holiday: null };
  }

  const schedule = await workScheduleGateway.findById(user.workScheduleId);
  if (!schedule) {
    return { expectedMinutes: 0, holiday: null };
  }

  return {
    expectedMinutes: schedule.expectedMinutesForDate(date),
    holiday: null,
  };
}
