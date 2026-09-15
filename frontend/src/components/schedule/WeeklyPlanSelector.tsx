import type { WeeklyPlan } from "../../types/weeklyPlan";

interface WeeklyPlanSelectorProps {
  weeklyPlans: WeeklyPlan[];
  activePlanId: string;
  onChange: (planId: string) => void;
}

const WeeklyPlanSelector = ({
  weeklyPlans,
  activePlanId,
  onChange,
}: WeeklyPlanSelectorProps) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <label className="block text-sm font-medium text-gray-700">
        Weekly plan
      </label>

      <select
        value={activePlanId}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 sm:max-w-md"
      >
        {weeklyPlans.map((plan) => (
          <option key={plan._id} value={plan._id}>
            {new Date(
              `${plan.weekStart.slice(0, 10)}T00:00:00`,
            ).toLocaleDateString()}{" "}
            —{" "}
            {new Date(
              `${plan.weekEnd.slice(0, 10)}T00:00:00`,
            ).toLocaleDateString()}
          </option>
        ))}
      </select>
    </section>
  );
};

export default WeeklyPlanSelector;
