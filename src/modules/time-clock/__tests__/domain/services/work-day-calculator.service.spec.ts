import { calculateWorkDay } from '../../../domain/services/work-day-calculator.service';
import { TimeEntry } from '../../../domain/time-entry.entity';
import { PunchType } from '@/modules/@shared/domain/enums';

const punch = (type: PunchType, isoTime: string) =>
  TimeEntry.create({
    workDayId: '00000000-0000-4000-8000-000000000000',
    punchType: type,
    punchedAt: new Date(isoTime),
    outsideStudio: false,
  });

describe('calculateWorkDay', () => {
  it('vazio → tudo zero, isComplete true', () => {
    const t = calculateWorkDay([], 480);
    expect(t).toEqual({
      workedMinutes: 0,
      breakMinutes: 0,
      overtimeMinutes: 0,
      hourBankDelta: -480,
      isComplete: true,
    });
  });

  it('1 par fechado (8h) → workedMinutes=480, sem break, sem overtime', () => {
    const punches = [
      punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00'),
      punch(PunchType.CLOCK_OUT, '2026-04-27T17:00:00'),
    ];
    const t = calculateWorkDay(punches, 480);
    expect(t.workedMinutes).toBe(480);
    expect(t.breakMinutes).toBe(0);
    expect(t.overtimeMinutes).toBe(0);
    expect(t.hourBankDelta).toBe(0);
    expect(t.isComplete).toBe(true);
  });

  it('2 pares (manhã + tarde) → soma os pares, break = gap', () => {
    const punches = [
      punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00'),
      punch(PunchType.CLOCK_OUT, '2026-04-27T12:00:00'),
      punch(PunchType.CLOCK_IN, '2026-04-27T13:00:00'),
      punch(PunchType.CLOCK_OUT, '2026-04-27T18:00:00'),
    ];
    const t = calculateWorkDay(punches, 480);
    expect(t.workedMinutes).toBe(180 + 300);
    expect(t.breakMinutes).toBe(60);
    expect(t.overtimeMinutes).toBe(0);
    expect(t.hourBankDelta).toBe(0);
    expect(t.isComplete).toBe(true);
  });

  it('overtime quando worked > expected', () => {
    const punches = [
      punch(PunchType.CLOCK_IN, '2026-04-27T08:00:00'),
      punch(PunchType.CLOCK_OUT, '2026-04-27T18:00:00'),
    ];
    const t = calculateWorkDay(punches, 480);
    expect(t.workedMinutes).toBe(600);
    expect(t.overtimeMinutes).toBe(120);
    expect(t.hourBankDelta).toBe(120);
  });

  it('par ímpar → isComplete=false (calcula só os pares fechados)', () => {
    const punches = [
      punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00'),
      punch(PunchType.CLOCK_OUT, '2026-04-27T12:00:00'),
      punch(PunchType.CLOCK_IN, '2026-04-27T13:00:00'),
    ];
    const t = calculateWorkDay(punches, 480);
    expect(t.workedMinutes).toBe(180);
    expect(t.isComplete).toBe(false);
  });

  it('hourBankDelta negativo quando trabalha menos que esperado', () => {
    const punches = [
      punch(PunchType.CLOCK_IN, '2026-04-27T09:00:00'),
      punch(PunchType.CLOCK_OUT, '2026-04-27T13:00:00'),
    ];
    const t = calculateWorkDay(punches, 480);
    expect(t.workedMinutes).toBe(240);
    expect(t.hourBankDelta).toBe(-240);
    expect(t.overtimeMinutes).toBe(0);
  });
});
