import {
  findHolidayForDate,
  isMatchingHoliday,
} from '../../../domain/services/holiday-resolver.service';
import { Holiday } from '../../../domain/holiday.entity';
import { HolidayType } from '@/modules/@shared/domain/enums';

const make = (date: string, isRecurring: boolean, name = 'Test'): Holiday =>
  Holiday.create({
    name,
    date: new Date(date),
    type: HolidayType.NATIONAL,
    isRecurring,
  });

describe('isMatchingHoliday', () => {
  it('feriado não-recorrente: match exato (ano+mês+dia)', () => {
    const h = make('2026-09-07', false);
    expect(isMatchingHoliday(h, new Date('2026-09-07'))).toBe(true);
    expect(isMatchingHoliday(h, new Date('2027-09-07'))).toBe(false);
    expect(isMatchingHoliday(h, new Date('2026-09-08'))).toBe(false);
  });

  it('feriado recorrente: match por mês+dia (qualquer ano)', () => {
    const h = make('2026-09-07', true);
    expect(isMatchingHoliday(h, new Date('2026-09-07'))).toBe(true);
    expect(isMatchingHoliday(h, new Date('2027-09-07'))).toBe(true);
    expect(isMatchingHoliday(h, new Date('2030-09-07'))).toBe(true);
    expect(isMatchingHoliday(h, new Date('2026-09-08'))).toBe(false);
    expect(isMatchingHoliday(h, new Date('2026-08-07'))).toBe(false);
  });
});

describe('findHolidayForDate', () => {
  it('retorna o primeiro feriado que combina', () => {
    const holidays = [
      make('2026-01-01', true, 'Ano Novo'),
      make('2026-04-21', true, 'Tiradentes'),
      make('2026-09-07', false, 'Independência 2026'),
    ];
    expect(findHolidayForDate(holidays, new Date('2027-04-21'))?.name).toBe(
      'Tiradentes',
    );
    expect(findHolidayForDate(holidays, new Date('2026-09-07'))?.name).toBe(
      'Independência 2026',
    );
  });

  it('retorna null quando não há match', () => {
    const holidays = [make('2026-01-01', true)];
    expect(findHolidayForDate(holidays, new Date('2026-06-15'))).toBeNull();
  });
});
