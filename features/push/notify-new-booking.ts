import "server-only";

import {
  sendPushToAdmins,
} from "./send-admin-push";

export async function notifyNewBooking() {
  try {
    await sendPushToAdmins({
      title: "THE LORD",
      body:
        "Nouvelle demande de rendez-vous. Touchez pour consulter.",
      url:
        "/gestion/rendez-vous",
      tag:
        "new-appointment",
    });
  } catch (error) {
  
    console.error(
      "[Web Push] Unable to notify admin:",
      error,
    );
  }
}