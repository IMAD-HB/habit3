import type { TimeBlock } from "../../types/timeBlock";
import type { WeeklyPlan } from "../../types/weeklyPlan";

interface CurrentPlanCardProps {
  plan: WeeklyPlan;
  timeBlocks: TimeBlock[];
  selectedActivityId: string;
  onSelectActivity: (activityId: string) => void;
}

const CurrentPlanCard = ({
  plan,
  timeBlocks,
  selectedActivityId,
  onSelectActivity,
}: CurrentPlanCardProps) => {
  const formatPlanDate = (date: string) => {
    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const scheduledActivityIds = new Set(
    timeBlocks
      .filter((timeBlock) => timeBlock.status !== "cancelled")
      .map((timeBlock) =>
        typeof timeBlock.activityId === "string"
          ? timeBlock.activityId
          : timeBlock.activityId._id,
      ),
  );

  const scheduledPriorities = plan.priorities.filter((activity) =>
    scheduledActivityIds.has(activity._id),
  );

  const unscheduledPriorities = plan.priorities.filter(
    (activity) => !scheduledActivityIds.has(activity._id),
  );

  const renderPriority = (
    activity: WeeklyPlan["priorities"][number],
    scheduled: boolean,
  ) => (
    <button
      key={activity._id}
      type="button"
      onClick={() => onSelectActivity(activity._id)}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        selectedActivityId === activity._id
          ? "border-gray-900 bg-gray-900 text-white"
          : scheduled
            ? "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
            : "border-dashed border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-400 hover:text-gray-700"
      }`}
    >
      {activity.title}
    </button>
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Current weekly plan
          </p>
          <h2 className="mt-1 text-lg font-semibold">
            {formatPlanDate(plan.weekStart)} — {formatPlanDate(plan.weekEnd)}
          </h2>
        </div>

        <div className="text-sm text-gray-500">
          {plan.priorities.length} priority
          {plan.priorities.length === 1 ? "" : "ies"}
        </div>
      </div>

      {scheduledPriorities.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Scheduled
          </p>

          <div className="flex flex-wrap gap-2">
            {scheduledPriorities.map((activity) =>
              renderPriority(activity, true),
            )}
          </div>
        </div>
      )}

      {unscheduledPriorities.length > 0 && (
        <div className={scheduledPriorities.length > 0 ? "mt-5" : "mt-5"}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Not scheduled
          </p>

          <div className="flex flex-wrap gap-2">
            {unscheduledPriorities.map((activity) =>
              renderPriority(activity, false),
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CurrentPlanCard;
