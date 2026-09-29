export type MinuteRange = {
  start: number;
  end: number;
};

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time
    .slice(0, 5)
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}`;
}

/**
 * Tests [startA, endA) against [startB, endB).
 *
 * 10:00 -> 10:30
 * 10:30 -> 11:00
 *
 * does NOT overlap.
 */
export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
): boolean {
  return startA < endB && endA > startB;
}

export function getDayOfWeek(date: string): number {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  return new Date(
    Date.UTC(year, month - 1, day),
  ).getUTCDay();
}

export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    Math.max(value, min),
    max,
  );
}