import "server-only";

import webpush from "web-push";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  pushSubscriptions,
} from "@/db/schema";

type AdminPushPayload = {
  title: string;
  body: string;
  url: string;
  tag?: string;
};

function configureWebPush() {
  const publicKey =
    process.env
      .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  const privateKey =
    process.env
      .VAPID_PRIVATE_KEY;

  const subject =
    process.env
      .VAPID_SUBJECT;

  if (
    !publicKey ||
    !privateKey ||
    !subject
  ) {
    throw new Error(
      "Configuration VAPID manquante.",
    );
  }

  webpush.setVapidDetails(
    subject,
    publicKey,
    privateKey,
  );
}

export async function sendPushToAdmins(
  payload: AdminPushPayload,
) {
  configureWebPush();

  const subscriptions =
    await db
      .select()
      .from(pushSubscriptions);

  if (
    subscriptions.length === 0
  ) {
    return;
  }

  const message =
    JSON.stringify(payload);

  const results =
    await Promise.allSettled(
      subscriptions.map(
        async (subscription) => {
          try {
            await webpush.sendNotification(
              {
                endpoint:
                  subscription.endpoint,

                keys: {
                  p256dh:
                    subscription.p256dh,

                  auth:
                    subscription.auth,
                },
              },
              message,
            );
          } catch (error) {
            /*
             * 404 / 410 :
             * la subscription n'existe plus
             * chez le Push Service.
             *
             * On nettoie automatiquement
             * notre DB.
             */
            if (
              isWebPushError(error) &&
              (error.statusCode ===
                404 ||
                error.statusCode ===
                  410)
            ) {
              await db
                .delete(
                  pushSubscriptions,
                )
                .where(
                  eq(
                    pushSubscriptions.id,
                    subscription.id,
                  ),
                );

              return;
            }

            throw error;
          }
        },
      ),
    );

  /*
   * Une notification qui échoue sur un
   * appareil ne doit pas empêcher les
   * autres appareils de la recevoir.
   */
  for (const result of results) {
    if (
      result.status === "rejected"
    ) {
      console.error(
        "[Web Push] send failed:",
        result.reason,
      );
    }
  }
}

function isWebPushError(
  error: unknown,
): error is {
  statusCode: number;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (
      error as {
        statusCode?: unknown;
      }
    ).statusCode === "number"
  );
}