"use client";

import {
  Bell,
  Loader2,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  subscribeToPush,
} from "@/features/push/actions";

const DISMISSED_KEY =
  "push-notification-dismissed";

export function PushNotificationManager() {
  const [open, setOpen] =
    useState(false);

  const [pending, setPending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    // Vérifie que le navigateur supporte Web Push
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      return;
    }

    // L'utilisateur a explicitement bloqué
    // les notifications dans son navigateur.
    if (
      Notification.permission === "denied"
    ) {
      return;
    }

    try {
      const registration =
        await navigator.serviceWorker.register(
          "/sw.js",
        );

      const subscription =
        await registration.pushManager.getSubscription();

      /*
       * Une subscription existe déjà sur cet appareil.
       *
       * On la resynchronise avec la DB.
       * Cela permet de réparer automatiquement le cas :
       *
       * navigateur = subscription présente
       * DB = ligne supprimée
       */
      if (subscription) {
        const json =
          subscription.toJSON();

        if (
          json.endpoint &&
          json.keys?.p256dh &&
          json.keys?.auth
        ) {
          const result =
            await subscribeToPush({
              endpoint: json.endpoint,
              keys: {
                p256dh:
                  json.keys.p256dh,
                auth:
                  json.keys.auth,
              },
            });

          if (!result.success) {
            console.error(
              "[Push] synchronization failed:",
              result.error,
            );
          }
        }

        return;
      }

      /*
       * L'utilisateur a choisi "Plus tard"
       * pendant cette session.
       */
      const dismissed =
        sessionStorage.getItem(
          DISMISSED_KEY,
        );

      if (dismissed === "true") {
        return;
      }

      // Pas encore abonné :
      // on affiche la modal.
      setOpen(true);
    } catch (error) {
      console.error(
        "[Push] initialization error:",
        error,
      );
    }
  }

  async function enableNotifications() {
    setPending(true);
    setError(null);

    try {
      const vapidPublicKey =
        process.env
          .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        throw new Error(
          "Clé VAPID publique manquante.",
        );
      }

      /*
       * IMPORTANT :
       * requestPermission() est déclenché ici
       * suite à un clic utilisateur.
       */
      const permission =
        await Notification.requestPermission();

      if (
        permission !== "granted"
      ) {
        setOpen(false);
        return;
      }

      const registration =
        await navigator.serviceWorker.ready;

      let subscription =
        await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription =
          await registration.pushManager.subscribe(
            {
              userVisibleOnly: true,

              applicationServerKey:
                urlBase64ToUint8Array(
                  vapidPublicKey,
                ),
            },
          );
      }

      const json =
        subscription.toJSON();

      if (
        !json.endpoint ||
        !json.keys?.p256dh ||
        !json.keys?.auth
      ) {
        throw new Error(
          "Subscription Web Push invalide.",
        );
      }

      /*
       * Sauvegarde / UPSERT dans Supabase.
       */
      const result =
        await subscribeToPush({
          endpoint:
            json.endpoint,

          keys: {
            p256dh:
              json.keys.p256dh,

            auth:
              json.keys.auth,
          },
        });

      if (!result.success) {
        throw new Error(
          result.error,
        );
      }

      /*
       * Si l'utilisateur avait précédemment
       * choisi "Plus tard", on nettoie le flag.
       */
      sessionStorage.removeItem(
        DISMISSED_KEY,
      );

      setOpen(false);
    } catch (error) {
      console.error(
        "[Push] subscription error:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'activer les notifications.",
      );
    } finally {
      setPending(false);
    }
  }

  function dismissForSession() {
    sessionStorage.setItem(
      DISMISSED_KEY,
      "true",
    );

    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/70
        p-4
        backdrop-blur-sm
        sm:items-center
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="push-notification-title"
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-surface
          p-6
          shadow-2xl
        "
      >
        {/* Fermer = Plus tard */}
        <button
          type="button"
          onClick={
            dismissForSession
          }
          aria-label="Fermer"
          className="
            absolute
            right-4
            top-4
            flex
            size-9
            items-center
            justify-center
            rounded-xl
            text-white/40
            transition
            hover:bg-white/5
            hover:text-white
          "
        >
          <X className="size-4" />
        </button>

        <div
          className="
            flex
            size-12
            items-center
            justify-center
            rounded-2xl
            bg-brand/10
            text-brand
          "
        >
          <Bell className="size-6" />
        </div>

        <h2
          id="push-notification-title"
          className="
            mt-5
            text-xl
            font-bold
            tracking-[-0.03em]
            text-white
          "
        >
          Ne manquez aucune réservation
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-white/50
          "
        >
          Activez les notifications pour
          être averti lorsqu&apos;un client
          effectue une nouvelle demande de
          rendez-vous, même lorsque la
          gestion n&apos;est pas ouverte.
        </p>

        {error && (
          <p className="mt-4 text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 grid gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={
              enableNotifications
            }
            className="
              flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-brand
              px-5
              text-sm
              font-bold
              text-black
              transition
              hover:bg-brand-hover
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {pending ? (
              <>
                <Loader2
                  className="
                    size-4
                    animate-spin
                  "
                />

                Activation...
              </>
            ) : (
              <>
                <Bell className="size-4" />

                Activer les notifications
              </>
            )}
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={
              dismissForSession
            }
            className="
              min-h-11
              rounded-xl
              px-5
              text-xs
              font-medium
              text-white/40
              transition
              hover:bg-white/5
              hover:text-white/70
            "
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(
  base64String: string,
) {
  const padding =
    "=".repeat(
      (4 -
        (base64String.length % 4)) %
        4,
    );

  const base64 = (
    base64String + padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) =>
      char.charCodeAt(0),
    ),
  );
}