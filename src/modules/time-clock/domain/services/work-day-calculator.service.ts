import { PunchType } from '@/modules/@shared/domain/enums';
import { TimeEntry } from '../time-entry.entity';

export interface WorkDayTotals {
  workedMinutes: number;
  breakMinutes: number;
  overtimeMinutes: number;
  hourBankDelta: number;
  isComplete: boolean;
}

export function calculateWorkDay(
  punches: readonly TimeEntry[],
  expectedMinutes: number,
): WorkDayTotals {
  const sorted = [...punches].sort(
    (a, b) => a.punchedAt.getTime() - b.punchedAt.getTime(),
  );

  let workedMinutes = 0;
  let breakMinutes = 0;
  let pairOpen: TimeEntry | null = null;
  let lastClose: TimeEntry | null = null;

  for (const punch of sorted) {
    if (punch.punchType === PunchType.CLOCK_IN) {
      if (lastClose) {
        breakMinutes += diffMinutes(lastClose.punchedAt, punch.punchedAt);
      }
      pairOpen = punch;
    } else {
      if (pairOpen) {
        workedMinutes += diffMinutes(pairOpen.punchedAt, punch.punchedAt);
        lastClose = punch;
        pairOpen = null;
      }
    }
  }

  const isComplete = pairOpen === null;
  const overtimeMinutes = Math.max(0, workedMinutes - expectedMinutes);
  const hourBankDelta = workedMinutes - expectedMinutes;

  return {
    workedMinutes,
    breakMinutes,
    overtimeMinutes,
    hourBankDelta,
    isComplete,
  };
}

function diffMinutes(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / 60_000);
}
