import {
  daysBetween,
  eachDay,
} from '../../../domain/services/date-range.service';

describe('eachDay', () => {
  it('mesmo dia → 1 entrada', () => {
    const d = new Date(2026, 4, 5);
    expect(eachDay(d, d)).toHaveLength(1);
  });

  it('5 dias consecutivos', () => {
    const start = new Date(2026, 4, 5);
    const end = new Date(2026, 4, 9);
    const days = eachDay(start, end);
    expect(days).toHaveLength(5);
    expect(days[0].getDate()).toBe(5);
    expect(days[4].getDate()).toBe(9);
  });

  it('end < start → array vazio', () => {
    const start = new Date(2026, 4, 9);
    const end = new Date(2026, 4, 5);
    expect(eachDay(start, end)).toEqual([]);
  });

  it('atravessa virada de mês', () => {
    const start = new Date(2026, 0, 30);
    const end = new Date(2026, 1, 2);
    expect(daysBetween(start, end)).toBe(4);
  });
});
