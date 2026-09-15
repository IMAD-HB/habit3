import api from "../lib/api";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const urlBase64ToArrayBuffer = (base64String: string): ArrayBuffer => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const bytes = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    bytes[index] = rawData.charCodeAt(index);
  }

  return bytes.buffer;
};

export const enablePushNotifications = async (): Promise<void> => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported by this browser.");
  }

  if (!("PushManager" in window)) {
    throw new Error("Push notifications are not supported by this browser.");
  }

  if (!("Notification" in window)) {
    throw new Error("Notifications are not supported by this browser.");
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error("VITE_VAPID_PUBLIC_KEY is not configured.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");

  const existingSubscription = await registration.pushManager.getSubscription();

  const subscription =
    existingSubscription ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToArrayBuffer(VAPID_PUBLIC_KEY),
    }));

  await api.post("/push/subscribe", subscription.toJSON());
};
