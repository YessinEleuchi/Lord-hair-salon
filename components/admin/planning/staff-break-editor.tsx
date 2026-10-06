"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createStaffBreak,
  deleteStaffBreak,
  updateStaffBreak,
} from "@/features/planning/actions/staff-break-actions";

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
  dayOfWeek: number;
  breaks: BreakItem[];
};

export function StaffBreakEditor({
  staffId,
  dayOfWeek,
  breaks,
}: Props) {
  const [
    adding,
    setAdding,
  ] = useState(false);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
        Pauses
      </p>

      {breaks.length === 0 ? (
        <p className="mt-2 text-xs text-white/30">
          Aucune pause configurée.
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {breaks.map(
            (item) => (
              <BreakRow
                key={item.id}
                staffId={
                  staffId
                }
                item={item}
              />
            ),
          )}
        </div>
      )}

      {adding ? (
        <NewBreak
          staffId={staffId}
          dayOfWeek={
            dayOfWeek
          }
          onCancel={() =>
            setAdding(false)
          }
        />
      ) : (
        <button
          type="button"
          onClick={() =>
            setAdding(true)
          }
          className="
            mt-3
            flex
            min-h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-dashed
            border-white/10
            text-xs
            font-medium
            text-white/35
            transition
            hover:border-brand/30
            hover:text-brand
          "
        >
          <Plus className="size-3.5" />

          Ajouter une pause
        </button>
      )}
    </div>
  );
}

function BreakRow({
  staffId,
  item,
}: {
  staffId: string;
  item: BreakItem;
}) {
  const [
    startTime,
    setStartTime,
  ] = useState(
    item.startTime,
  );

  const [
    endTime,
    setEndTime,
  ] = useState(
    item.endTime,
  );

  const [
    pending,
    startTransition,
  ] = useTransition();

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  function save() {
    setError(null);

    startTransition(async () => {
      const result =
        await updateStaffBreak(
          item.id,
          {
            staffId,
            dayOfWeek:
              item.dayOfWeek,
            startTime,
            endTime,
            label:
              item.label ??
              "Pause",
          },
        );

      if (!result.success) {
        setError(result.message);
      }
    });
  }

  function remove() {
    setError(null);

    startTransition(async () => {
      const result =
        await deleteStaffBreak(
          item.id,
        );

      if (!result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          type="time"
          value={startTime}
          onChange={(event) =>
            setStartTime(
              event.target.value,
            )
          }
          className="min-h-10 min-w-0 rounded-lg border border-white/10 bg-background px-2 text-center text-xs text-white outline-none focus:border-brand/50"
        />

        <span className="text-xs text-white/20">
          à
        </span>

        <input
          type="time"
          value={endTime}
          onChange={(event) =>
            setEndTime(
              event.target.value,
            )
          }
          className="min-h-10 min-w-0 rounded-lg border border-white/10 bg-background px-2 text-center text-xs text-white outline-none focus:border-brand/50"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="min-h-9 rounded-lg bg-white/[0.06] px-3 text-xs font-medium text-white/55"
        >
          {pending
            ? "..."
            : "Modifier"}
        </button>

        <button
          type="button"
          onClick={remove}
          disabled={pending}
          aria-label="Supprimer la pause"
          className="flex size-9 items-center justify-center rounded-lg text-white/25 transition hover:bg-red-500/10 hover:text-red-300"
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function NewBreak({
  staffId,
  dayOfWeek,
  onCancel,
}: {
  staffId: string;
  dayOfWeek: number;
  onCancel: () => void;
}) {
  const [
    startTime,
    setStartTime,
  ] = useState("13:00");

  const [
    endTime,
    setEndTime,
  ] = useState("15:00");

  const [
    pending,
    startTransition,
  ] = useTransition();

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  function create() {
    setError(null);

    startTransition(async () => {
      const result =
        await createStaffBreak({
          staffId,
          dayOfWeek,
          startTime,
          endTime,
          label: "Pause",
        });

      if (!result.success) {
        setError(result.message);
        return;
      }

      onCancel();
    });
  }

  return (
    <div className="mt-3 rounded-xl border border-brand/15 bg-brand/[0.025] p-3">
      <p className="mb-2 text-xs font-medium text-white/55">
        Nouvelle pause
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          type="time"
          value={startTime}
          onChange={(event) =>
            setStartTime(
              event.target.value,
            )
          }
          className="min-h-10 min-w-0 rounded-lg border border-white/10 bg-background px-2 text-center text-xs text-white outline-none"
        />

        <span className="text-xs text-white/20">
          à
        </span>

        <input
          type="time"
          value={endTime}
          onChange={(event) =>
            setEndTime(
              event.target.value,
            )
          }
          className="min-h-10 min-w-0 rounded-lg border border-white/10 bg-background px-2 text-center text-xs text-white outline-none"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="min-h-10 rounded-lg border border-white/10 text-xs text-white/40"
        >
          Annuler
        </button>

        <button
          type="button"
          onClick={create}
          disabled={pending}
          className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand text-xs font-semibold text-black"
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}

          Ajouter
        </button>
      </div>
    </div>
  );
}