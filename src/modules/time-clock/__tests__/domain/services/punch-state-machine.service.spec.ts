import { TimeEntry } from '../../../domain/time-entry.entity';
import {
  assertChronological,
  assertExpectedType,
  nextExpectedPunchType,
} from '../../../domain/services/punch-state-machine.service';
import { PunchType } from '@/modules/@shared/domain/enums';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const punch = (type: PunchType, isoTime: string) =>
  TimeEntry.create({
    workDayId: '00000000-0000-4000-8000-000000000000',
    punchType: type,
    punchedAt: new Date(isoTime),
    outsideStudio: false,
  });

describe('nextExpectedPunchType', () => {
  it('vazio → CLOCK_IN', () => {
    expect(nextExpectedPunchType([])).toBe(PunchType.CLOCK_IN);
  });
  it('1 batida → CLOCK_OUT', () => {
    expect(
      nextExpectedPunchType([punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00')]),
    ).toBe(PunchType.CLOCK_OUT);
  });
  it('2 batidas (par fechado) → CLOCK_IN', () => {
    expect(
      nextExpectedPunchType([
        punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00'),
        punch(PunchType.CLOCK_OUT, '2026-04-27T12:00:00'),
      ]),
    ).toBe(PunchType.CLOCK_IN);
  });
});

describe('assertExpectedType', () => {
  it('aceita o tipo esperado', () => {
    expect(() => assertExpectedType([], PunchType.CLOCK_IN)).not.toThrow();
  });
  it('rejeita tipo errado', () => {
    expect(() => assertExpectedType([], PunchType.CLOCK_OUT)).toThrow(
      EntityValidationError,
    );
  });
});

describe('assertChronological', () => {
  it('vazio → ok', () => {
    expect(() =>
      assertChronological([], new Date('2026-04-27T09:00:00')),
    ).not.toThrow();
  });
  it('aceita timestamp posterior', () => {
    expect(() =>
      assertChronological(
        [punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00')],
        new Date('2026-04-27T12:00:00'),
      ),
    ).not.toThrow();
  });
  it('rejeita timestamp anterior', () => {
    expect(() =>
      assertChronological(
        [punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00')],
        new Date('2026-04-27T08:00:00'),
      ),
    ).toThrow(EntityValidationError);
  });
  it('rejeita timestamp igual', () => {
    expect(() =>
      assertChronological(
        [punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00')],
        new Date('2026-04-27T09:00:00'),
      ),
    ).toThrow(EntityValidationError);
  });
});
