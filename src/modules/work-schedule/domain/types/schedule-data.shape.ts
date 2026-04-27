export interface DaySchedule {
  start: string;
  end: string;
  breakMinutes: number;
}

export type Weekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type WeeklySchedule = {
  [K in Weekday]: DaySchedule | null;
};

export const WEEKDAYS: readonly Weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map((n) => parseInt(n, 10));
  return hours * 60 + minutes;
}

export function weekdayOf(date: Date): Weekday {
  return WEEKDAYS[date.getDay()];
}
