import SettingsHeader from "../components/settings/SettingsHeader";
import AccountSettings from "../components/settings/AccountSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import PasswordSettings from "../components/settings/PasswordSettings";
import DeleteAccountSection from "../components/settings/DeleteAccountSection";

import { useAuthStore } from "../stores/authStore";

const SettingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <SettingsHeader />

      <div className="space-y-8">
        <AccountSettings user={user} onUpdated={setUser} />
        <NotificationSettings />
        <PasswordSettings />
        <DeleteAccountSection />
      </div>
    </main>
  );
};

export default SettingsPage;
