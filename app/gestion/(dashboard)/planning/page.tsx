import {
  CalendarRange,
  Clock3,
} from "lucide-react";

import {
  ScheduleOverrideForm,
} from "@/components/admin/planning/schedule-form";

import {
  ScheduleOverrideList,
} from "@/components/admin/planning/schedule-list";

import {
  WorkingHoursEditor,
} from "@/components/admin/planning/working-hours-editor";

import {
  getPlanningStaff,
  getStaffBreaks,
  getStaffScheduleOverrides,
  getStaffWorkingHours,
} from "@/features/planning/queries";

export default async function PlanningPage() {
  const staff =
    await getPlanningStaff();

  const selectedStaff =
    staff[0] ?? null;

  const [
    workingHours,
    breaks,
    overrides,
  ] = selectedStaff
    ? await Promise.all([
        getStaffWorkingHours(
          selectedStaff.id,
        ),

        getStaffBreaks(
          selectedStaff.id,
        ),

        getStaffScheduleOverrides(
          selectedStaff.id,
        ),
      ])
    : [[], [], []];

  return (
    <div className="min-w-0">

      <section>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
          Gestion
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl">
          Planning
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          Gérez les jours
          d&apos;ouverture, les
          horaires, les pauses et
          les exceptions disponibles
          pour les réservations.
        </p>
      </section>

      {!selectedStaff ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-surface px-5 py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-white/25">
            <Clock3 className="size-5" />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-white">
            Aucun coiffeur
          </h2>

          <p className="mt-1.5 text-sm text-white/35">
            Aucun membre actif
            n&apos;est disponible.
          </p>
        </div>
      ) : (
        <>

          <section className="mt-6 rounded-2xl border border-white/10 bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Clock3 className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                  Planning de
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {selectedStaff.name}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-4">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                Planning habituel
              </p>

              <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
                Semaine
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-white/35">
                Définissez les jours
                travaillés, les heures
                d&apos;ouverture et les
                pauses habituelles.
              </p>
            </div>

            <WorkingHoursEditor
              staffId={
                selectedStaff.id
              }
              workingHours={
                workingHours
              }
              breaks={breaks}
            />
          </section>

          <section className="mt-10">
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <CalendarRange className="size-4" />
                </div>

                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
                    Exceptions
                  </p>

                  <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.03em] text-white">
                    Dates particulières
                  </h2>
                </div>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
                Fermez exceptionnellement
                une journée ou appliquez
                des horaires différents
                sans modifier le planning
                habituel.
              </p>
            </div>

            <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              {/* ADD / UPDATE */}

              <ScheduleOverrideForm
                staffId={
                  selectedStaff.id
                }
              />

              {/* LIST */}

              <div className="min-w-0">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                  Exceptions enregistrées
                </p>

                <ScheduleOverrideList
                  overrides={
                    overrides
                  }
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}