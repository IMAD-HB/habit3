import type { Activity, Quadrant } from "../../types/activity";

interface ActivityPriorityListProps {
  activities: Activity[];
  selectedPriorities: string[];
  onTogglePriority: (activityId: string) => void;
}

const quadrantLabels: Record<Quadrant, string> = {
  I: "Urgent & Important",
  II: "Important",
  III: "Urgent",
  IV: "Neither",
};

const quadrantClasses: Record<Quadrant, string> = {
  I: "bg-red-100 text-red-700",
  II: "bg-blue-100 text-blue-700",
  III: "bg-yellow-100 text-yellow-700",
  IV: "bg-gray-100 text-gray-600",
};

const ActivityPriorityList = ({
  activities,
  selectedPriorities,
  onTogglePriority,
}: ActivityPriorityListProps) => {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Choose your priorities
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the activities that deserve protected time this week.
        </p>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const role =
            typeof activity.roleId === "string" ? null : activity.roleId;

          const isSelected = selectedPriorities.includes(activity._id);

          return (
            <button
              key={activity._id}
              type="button"
              onClick={() => onTogglePriority(activity._id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    isSelected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-gray-900">
                      {activity.title}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${quadrantClasses[activity.quadrant]}`}
                    >
                      Q{activity.quadrant}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {role && (
                      <span
                        className="rounded-full px-2 py-1"
                        style={{
                          backgroundColor: role.color
                            ? `${role.color}20`
                            : undefined,
                          color: role.color || undefined,
                        }}
                      >
                        {role.name}
                      </span>
                    )}

                    <span>{quadrantLabels[activity.quadrant]}</span>

                    {activity.estimatedDuration && (
                      <span>{activity.estimatedDuration} min</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ActivityPriorityList;
