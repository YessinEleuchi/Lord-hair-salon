type WorkingHour = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

const DAYS: Record<number, string> = {
  0: "Dim",
  1: "Lun",
  2: "Mar",
  3: "Mer",
  4: "Jeu",
  5: "Ven",
  6: "Sam",
};

function normalizeTime(value: string) {
  return value.slice(0, 5);
}

export function formatWorkingHours(
  workingHours: WorkingHour[],
) {
  return workingHours
    .sort((a, b) => {
      // Monday -> Sunday
      const orderA =
        a.dayOfWeek === 0 ? 7 : a.dayOfWeek;

      const orderB =
        b.dayOfWeek === 0 ? 7 : b.dayOfWeek;

      return orderA - orderB;
    })
    .map((item) => ({
      dayOfWeek: item.dayOfWeek,
      day: DAYS[item.dayOfWeek] ?? "—",

      enabled: item.enabled,

      startTime: normalizeTime(item.startTime),
      endTime: normalizeTime(item.endTime),
    }));
}