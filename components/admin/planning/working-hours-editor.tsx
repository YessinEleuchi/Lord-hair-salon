import {
  WorkingDayCard,
} from "@/components/admin/planning/working-day-card";

type WorkingHour = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

type BreakItem = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  label: string | null;
  enabled: boolean;
};

type Props = {
  staffId: string;
  workingHours: WorkingHour[];
  breaks: BreakItem[];
};

const DAYS = [
  {
    value: 1,
    label: "Lundi",
  },
  {
    value: 2,
    label: "Mardi",
  },
  {
    value: 3,
    label: "Mercredi",
  },
  {
    value: 4,
    label: "Jeudi",
  },
  {
    value: 5,
    label: "Vendredi",
  },
  {
    value: 6,
    label: "Samedi",
  },
  {
    value: 0,
    label: "Dimanche",
  },
] as const;

export function WorkingHoursEditor({
  staffId,
  workingHours,
  breaks,
}: Props) {
  return (
    <div className="space-y-3">
      {DAYS.map((day) => {
        const workingHour =
          workingHours.find(
            (item) =>
              item.dayOfWeek ===
              day.value,
          );

        const dayBreaks =
          breaks.filter(
            (item) =>
              item.dayOfWeek ===
                day.value &&
              item.enabled,
          );

        return (
          <WorkingDayCard
            key={day.value}
            staffId={staffId}
            dayOfWeek={day.value}
            label={day.label}
            workingHour={
              workingHour
            }
            breaks={dayBreaks}
          />
        );
      })}
    </div>
  );
}