import { PunchType } from '@/modules/@shared/domain/enums';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { TimeEntry } from '../time-entry.entity';

export function nextExpectedPunchType(
  punches: readonly TimeEntry[],
): PunchType {
  return punches.length % 2 === 0 ? PunchType.CLOCK_IN : PunchType.CLOCK_OUT;
}

export function assertChronological(
  punches: readonly TimeEntry[],
  nextPunchedAt: Date,
): void {
  if (punches.length === 0) return;
  const last = punches[punches.length - 1];
  if (nextPunchedAt.getTime() <= last.punchedAt.getTime()) {
    throw new EntityValidationError([
      {
        field: 'punchedAt',
        message: 'A nova batida deve ser posterior à última registrada',
      },
    ]);
  }
}

export function assertExpectedType(
  punches: readonly TimeEntry[],
  attemptedType: PunchType,
): void {
  const expected = nextExpectedPunchType(punches);
  if (expected !== attemptedType) {
    throw new EntityValidationError([
      {
        field: 'punchType',
        message: `Esperado ${expected}, recebido ${attemptedType}`,
      },
    ]);
  }
}
