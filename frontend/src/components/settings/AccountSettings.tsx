import { useState } from "react";

import { toast } from "sonner";

import { updateAccount } from "../../services/authService";

import type { AuthUser } from "../../services/authService";

interface AccountSettingsProps {
  user: AuthUser;
  onUpdated: (user: AuthUser) => void;
}

const AccountSettings = ({ user, onUpdated }: AccountSettingsProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await updateAccount(name, email);
      const updatedUser = response.data.user;

      onUpdated(updatedUser);

      setName(updatedUser.name);
      setEmail(updatedUser.email);

      toast.success("Account information updated successfully.");
    } catch {
      toast.error("Unable to update account information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Account information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your name and email address.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div>
          <label
            htmlFor="settings-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Name
          </label>

          <input
            id="settings-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="settings-email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
            id="settings-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
};

export default AccountSettings;
