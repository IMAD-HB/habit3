import type { Role } from "../../types/role";

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  isDeleting: boolean;
}

const RoleCard = ({ role, onEdit, onDelete, isDeleting }: RoleCardProps) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="mt-1 h-3 w-3 shrink-0 rounded-full bg-slate-400"
            style={{
              backgroundColor: role.color || undefined,
            }}
          />

          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900">{role.name}</h2>

            {role.description && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {role.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(role)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(role)}
          disabled={isDeleting}
          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default RoleCard;
