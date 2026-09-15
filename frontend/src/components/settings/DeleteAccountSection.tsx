import { useState } from "react";

import { toast } from "sonner";

import { deleteAccount } from "../../services/authService";

import { useAuthStore } from "../../stores/authStore";

import { useNavigate } from "react-router-dom";

const DeleteAccountSection = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteAccount();

      logout();

      toast.success("Your account has been deleted.");

      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to delete your account.");
      setIsDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-700">Delete account</h2>

          <p className="mt-1 text-sm text-slate-500">
            Permanently delete your account and all of your Habit 3 data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          disabled={loading}
          className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Delete account
        </button>
      </section>

      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h3
                id="delete-account-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete your account?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                This will permanently delete your account, roles, activities,
                weekly plans, and scheduled time blocks. This action cannot be
                undone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteAccountSection;
