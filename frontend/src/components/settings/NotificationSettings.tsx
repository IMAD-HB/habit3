import { useState } from "react";

import { toast } from "sonner";

import { enablePushNotifications } from "../../services/pushService";

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(
    typeof Notification !== "undefined" &&
      Notification.permission === "granted",
  );

  const handleEnable = async () => {
    setLoading(true);

    try {
      await enablePushNotifications();
      setEnabled(true);
      toast.success("Notifications enabled successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to enable notifications.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">
          Receive notifications for your scheduled activities.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">
            Activity notifications
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {enabled
              ? "Notifications are enabled on this device."
              : "Enable notifications to receive activity reminders."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleEnable}
          disabled={loading || enabled}
          className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enabling..." : enabled ? "Enabled" : "Enable"}
        </button>
      </div>
    </section>
  );
};

export default NotificationSettings;
