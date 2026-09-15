import { Link } from "react-router-dom";

import type { Activity, Quadrant } from "../../types/activity";

interface WeeklyPrioritiesProps {
  priorities: Activity[];
  quadrantLabels: Record<Quadrant, string>;
  quadrantClasses: Record<Quadrant, string>;
}

const WeeklyPriorities = ({
  priorities,
  quadrantLabels,
  quadrantClasses,
}: WeeklyPrioritiesProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900">
            This week's priorities
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            The activities you chose to protect time for.
          </p>
        </div>

        <Link
          to="/weekly-plan"
          className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
        >
          View plan
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {priorities.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <p className="text-sm font-medium text-gray-900">
              No priorities selected
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Choose the activities that matter most this week.
            </p>

            <Link
              to="/weekly-plan"
              className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Choose priorities
            </Link>
          </div>
        ) : (
          priorities.map((activity) => {
            const role =
              typeof activity.roleId === "string" ? null : activity.roleId;

            return (
              <div
                key={activity._id}
                className="flex items-start gap-4 rounded-xl border border-gray-200 p-4"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-300 bg-gray-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
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
            );
          })
        )}
      </div>
    </section>
  );
};

export default WeeklyPriorities;
