import type { Activity, Quadrant } from "../../types/activity";

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (activity: Activity, completed: boolean) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
}

const quadrantStyles: Record<Quadrant, string> = {
  I: "bg-red-50 text-red-700 border-red-200",
  II: "bg-blue-50 text-blue-700 border-blue-200",
  III: "bg-amber-50 text-amber-700 border-amber-200",
  IV: "bg-slate-100 text-slate-600 border-slate-200",
};

const ActivityCard = ({
  activity,
  onToggleComplete,
  onEdit,
  onDelete,
}: ActivityCardProps) => {
  const role = typeof activity.roleId === "string" ? null : activity.roleId;

  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
        activity.completed ? "border-slate-200 opacity-60" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {role && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: role.color ? `${role.color}20` : "#f1f5f9",
                  color: role.color || "#475569",
                }}
              >
                {role.name}
              </span>
            )}

            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                quadrantStyles[activity.quadrant]
              }`}
            >
              Q{activity.quadrant}
            </span>
          </div>

          <h3
            className={`font-semibold text-slate-900 ${
              activity.completed ? "line-through" : ""
            }`}
          >
            {activity.title}
          </h3>

          {activity.description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {activity.description}
            </p>
          )}
        </div>

        <input
          type="checkbox"
          checked={activity.completed}
          onChange={(event) => onToggleComplete(activity, event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-slate-900"
          aria-label={`Mark ${activity.title} as completed`}
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">
          {activity.estimatedDuration
            ? `${activity.estimatedDuration} min estimated`
            : "No duration set"}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(activity)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(activity)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default ActivityCard;
