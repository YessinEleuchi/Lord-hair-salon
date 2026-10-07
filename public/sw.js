self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data
      ? event.data.json()
      : {};
  } catch (error) {
    console.error(
      "[SW] Invalid push payload:",
      error,
    );
  }

  const title =
    data.title || "THE LORD";

  const options = {
    body:
      data.body ||
      "Nouvelle notification",

    icon: "/icons/icon-192.png",

    badge: "/icons/badge-96.png",

    data: {
      url:
        data.url ||
        "/gestion/rendez-vous",
    },

    tag:
      data.tag ||
      "the-lord-notification",

    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options,
    ),
  );
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const path =
      event.notification.data?.url ||
      "/gestion/rendez-vous";

    const url = new URL(
      path,
      self.location.origin,
    ).href;

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then(
          async (clientList) => {
            /*
             * Si THE LORD est déjà ouvert,
             * on réutilise cette fenêtre.
             */
            for (const client of clientList) {
              if (
                "navigate" in client &&
                "focus" in client
              ) {
                await client.navigate(
                  url,
                );

                return client.focus();
              }
            }
            return clients.openWindow(
              url,
            );
          },
        ),
    );
  },
);