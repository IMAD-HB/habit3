import type { WeeklyPlan } from "../../types/weeklyPlan";

interface CurrentPlanCardProps {
  plan: WeeklyPlan;
  selectedActivityId: string;
  onSelectActivity: (activityId: string) => void;
}

const CurrentPlanCard = ({
  plan,
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

      <div className="mt-5 flex flex-wrap gap-2">
        {plan.priorities.map((activity) => (
          <button
            key={activity._id}
            type="button"
            onClick={() => onSelectActivity(activity._id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              selectedActivityId === activity._id
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400"
            }`}
          >
            {activity.title}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CurrentPlanCard;
