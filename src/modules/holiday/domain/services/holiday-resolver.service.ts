import { Holiday } from '../holiday.entity';

export function isMatchingHoliday(holiday: Holiday, date: Date): boolean {
  if (holiday.isRecurring) {
    return (
      holiday.date.getMonth() === date.getMonth() &&
      holiday.date.getDate() === date.getDate()
    );
  }
  return (
    holiday.date.getFullYear() === date.getFullYear() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getDate() === date.getDate()
  );
}

export function findHolidayForDate(
  holidays: Holiday[],
  date: Date,
): Holiday | null {
  return holidays.find((h) => isMatchingHoliday(h, date)) ?? null;
}
