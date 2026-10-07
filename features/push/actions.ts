"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { pushSubscriptions } from "@/db/schema";
import { requireAdmin } from "@/features/admin/auth/require-admin";

type PushSubscriptionInput = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

export async function subscribeToPush(
  subscription: PushSubscriptionInput,
) {
  const user = await requireAdmin();

  if (!user) {
    return {
      success: false,
      error: "Non autorisé.",
    };
  }

  if (
    !subscription.endpoint ||
    !subscription.keys?.p256dh ||
    !subscription.keys?.auth
  ) {
    return {
      success: false,
      error: "Subscription invalide.",
    };
  }

  await db
    .insert(pushSubscriptions)
    .values({
      userId: user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        userId: user.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updatedAt: new Date(),
      },
    });

  return {
    success: true,
  };
}

export async function unsubscribeFromPush(
  endpoint: string,
) {
  const user = await requireAdmin();

  if (!user) {
    return {
      success: false,
      error: "Non autorisé.",
    };
  }

  await db
    .delete(pushSubscriptions)
    .where(
      eq(
        pushSubscriptions.endpoint,
        endpoint,
      ),
    );

  return {
    success: true,
  };
}