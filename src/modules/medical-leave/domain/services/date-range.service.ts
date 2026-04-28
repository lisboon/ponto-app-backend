export function eachDay(start: Date, end: Date): Date[] {
  if (end.getTime() < start.getTime()) return [];
  const out: Date[] = [];
  const current = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (current.getTime() <= last.getTime()) {
    out.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return out;
}

export function daysBetween(start: Date, end: Date): number {
  return eachDay(start, end).length;
}
