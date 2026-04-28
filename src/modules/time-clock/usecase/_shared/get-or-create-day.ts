import { TimeClockGateway } from '../../gateway/time-clock.gateway';
import { WorkDay } from '../../domain/work-day.entity';
import { Holiday } from '@/modules/holiday/domain/holiday.entity';
import { DayStatus } from '@/modules/@shared/domain/enums';

export async function getOrCreateDay(
  userId: string,
  date: Date,
  expectedMinutes: number,
  holiday: Holiday | null,
  gateway: TimeClockGateway,
): Promise<{ day: WorkDay; created: boolean }> {
  const existing = await gateway.findDay(userId, date);
  if (existing) return { day: existing, created: false };

  const day = WorkDay.create({
    userId,
    date,
    status: holiday ? DayStatus.HOLIDAY : DayStatus.OPEN,
    expectedMinutes: holiday ? 0 : expectedMinutes,
    workedMinutes: holiday ? 0 : 0,
    breakMinutes: holiday ? 0 : 0,
    overtimeMinutes: holiday ? 0 : 0,
    hourBankDelta: holiday ? 0 : 0,
  });
  return { day, created: true };
}

export function dayKey(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
