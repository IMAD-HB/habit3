import type { Activity } from "../../types/activity";

interface WeeklyPrioritySummaryProps {
  activities: Activity[];
  selectedPriorities: string[];
  isSaving: boolean;
  hasCurrentPlan: boolean;
  isDeleting: boolean;
  onTogglePriority: (activityId: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

const WeeklyPrioritySummary = ({
  activities,
  selectedPriorities,
  isSaving,
  hasCurrentPlan,
  isDeleting,
  onTogglePriority,
  onSave,
  onDelete,
}: WeeklyPrioritySummaryProps) => {
  return (
    <aside className="h-fit space-y-4 lg:sticky lg:top-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">Weekly priorities</h2>

          <p className="mt-1 text-sm text-gray-500">
            {selectedPriorities.length} selected
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {selectedPriorities.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              No priorities selected yet.
            </p>
          ) : (
            selectedPriorities.map((priorityId, index) => {
              const activity = activities.find(
                (item) => item._id === priorityId,
              );

              if (!activity) {
                return null;
              }

              return (
                <div
                  key={priorityId}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Q{activity.quadrant}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onTogglePriority(priorityId)}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label={`Remove ${activity.title}`}
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            disabled={isSaving || activities.length === 0}
            onClick={onSave}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : hasCurrentPlan
                ? "Save changes"
                : "Create weekly plan"}
          </button>

          {hasCurrentPlan && (
            <button
              type="button"
              disabled={isDeleting}
              onClick={onDelete}
              className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete weekly plan"}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default WeeklyPrioritySummary;
