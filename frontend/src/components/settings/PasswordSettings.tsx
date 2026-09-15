import { useState } from "react";

import { toast } from "sonner";

import { changePassword } from "../../services/authService";

const PasswordSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password changed successfully.");
    } catch {
      toast.error("Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  const passwordField = (
    id: string,
    label: string,
    value: string,
    setValue: (value: string) => void,
    visible: boolean,
    setVisible: (value: boolean) => void,
    placeholder: string,
  ) => (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          placeholder={placeholder}
          required
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-900"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.5 12s3.75 7.5 10.5 7.5c1.694 0 3.23-.36 4.564-.934M6.228 6.228C7.883 5.16 9.84 4.5 12 4.5c6.75 0 10.5 7.5 10.5 7.5a18.178 18.178 0 0 1-3.08 4.022M6.228 6.228 3 3m3.228 3.228 12.544 12.544M12 9.75a2.25 2.25 0 1 0 2.25 2.25"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.208.07.43 0 .644C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Change password
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Use a new password that you do not use elsewhere.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        {passwordField(
          "current-password",
          "Current password",
          currentPassword,
          setCurrentPassword,
          showCurrentPassword,
          setShowCurrentPassword,
          "Current password",
        )}

        {passwordField(
          "new-password",
          "New password",
          newPassword,
          setNewPassword,
          showNewPassword,
          setShowNewPassword,
          "At least 8 characters",
        )}

        {passwordField(
          "confirm-password",
          "Confirm new password",
          confirmPassword,
          setConfirmPassword,
          showConfirmPassword,
          setShowConfirmPassword,
          "Repeat your new password",
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Changing password..." : "Change password"}
        </button>
      </form>
    </section>
  );
};

export default PasswordSettings;
