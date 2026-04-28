import { WorkDay } from '../../domain/work-day.entity';
import { TimeEntry } from '../../domain/time-entry.entity';
import { DayStatus, PunchType } from '@/modules/@shared/domain/enums';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const USER_ID = '00000000-0000-4000-8000-000000000001';
const today = () => new Date('2026-04-27');

const buildPunch = (type: PunchType, isoTime: string, workDayId: string) =>
  TimeEntry.create({
    workDayId,
    punchType: type,
    punchedAt: new Date(isoTime),
    outsideStudio: false,
  });

describe('WorkDay', () => {
  it('cria dia válido com defaults OPEN', () => {
    const d = WorkDay.create({
      userId: USER_ID,
      date: today(),
      expectedMinutes: 480,
    });
    expect(d.status).toBe(DayStatus.OPEN);
    expect(d.expectedMinutes).toBe(480);
    expect(d.punches).toHaveLength(0);
  });

  it('addPunch alterna IN/OUT e recompute totais', () => {
    const d = WorkDay.create({
      userId: USER_ID,
      date: today(),
      expectedMinutes: 480,
    });
    d.addPunch(buildPunch(PunchType.CLOCK_IN, '2026-04-27T09:00:00', d.id));
    d.addPunch(buildPunch(PunchType.CLOCK_OUT, '2026-04-27T17:00:00', d.id));
    expect(d.workedMinutes).toBe(480);
    expect(d.status).toBe(DayStatus.OPEN);
  });

  it('rejeita IN seguido de IN', () => {
    const d = WorkDay.create({ userId: USER_ID, date: today() });
    d.addPunch(buildPunch(PunchType.CLOCK_IN, '2026-04-27T09:00:00', d.id));
    expect(() =>
      d.addPunch(buildPunch(PunchType.CLOCK_IN, '2026-04-27T10:00:00', d.id)),
    ).toThrow(EntityValidationError);
  });

  it('rejeita batida em dia HOLIDAY', () => {
    const d = WorkDay.create({ userId: USER_ID, date: today() });
    d.markHoliday();
    expect(() =>
      d.addPunch(buildPunch(PunchType.CLOCK_IN, '2026-04-27T09:00:00', d.id)),
    ).toThrow(EntityValidationError);
  });

  it('close com par balanceado → CLOSED + WorkDayClosedEvent', () => {
    const d = WorkDay.create({
      userId: USER_ID,
      date: today(),
      expectedMinutes: 480,
    });
    d.addPunch(buildPunch(PunchType.CLOCK_IN, '2026-04-27T09:00:00', d.id));
    d.addPunch(buildPunch(PunchType.CLOCK_OUT, '2026-04-27T17:00:00', d.id));
    d.close(new Date('2026-04-27T17:01:00'));
    expect(d.status).toBe(DayStatus.CLOSED);
    expect(d.closedAt).toBeInstanceOf(Date);
    const events = d.pullEvents();
    expect(events.some((e) => e.eventName === 'WorkDayClosedEvent')).toBe(true);
  });

  it('close com par ímpar → INCOMPLETE', () => {
    const d = WorkDay.create({
      userId: USER_ID,
      date: today(),
      expectedMinutes: 480,
    });
    d.addPunch(buildPunch(PunchType.CLOCK_IN, '2026-04-27T09:00:00', d.id));
    d.close();
    expect(d.status).toBe(DayStatus.INCOMPLETE);
  });

  it('close idempotente em dia HOLIDAY', () => {
    const d = WorkDay.create({ userId: USER_ID, date: today() });
    d.markHoliday();
    d.close();
    expect(d.status).toBe(DayStatus.HOLIDAY);
  });

  it('markMedicalLeave zera totais e seta medicalLeaveId', () => {
    const d = WorkDay.create({
      userId: USER_ID,
      date: today(),
      expectedMinutes: 480,
    });
    d.markMedicalLeave('00000000-0000-4000-8000-000000000099');
    expect(d.status).toBe(DayStatus.MEDICAL_LEAVE);
    expect(d.expectedMinutes).toBe(0);
    expect(d.medicalLeaveId).toBe('00000000-0000-4000-8000-000000000099');
  });
});
