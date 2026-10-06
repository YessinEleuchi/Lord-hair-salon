import {
  redirect,
} from "next/navigation";

import {
  AdminLoginForm,
} from "@/components/admin/auth/login-form";

import {
  createClient,
} from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (user) {
    redirect("/gestion");
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md items-center">
        <section className="w-full">
          <div className="mb-8">
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand font-bold text-black">
              R
            </div>

            <p className="mt-6 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
              THE LORD
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Connectez-vous pour gérer
              les rendez-vous et le planning
              du salon.
            </p>
          </div>

          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}