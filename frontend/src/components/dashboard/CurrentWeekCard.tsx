import { Link } from "react-router-dom";

import type { WeeklyPlan } from "../../types/weeklyPlan";

interface CurrentWeekCardProps {
  currentPlan?: WeeklyPlan;
  formatDisplayDate: (date: string) => string;
}

const CurrentWeekCard = ({
  currentPlan,
  formatDisplayDate,
}: CurrentWeekCardProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Current week</p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            {currentPlan
              ? `${formatDisplayDate(currentPlan.weekStart)} – ${formatDisplayDate(
                  currentPlan.weekEnd,
                )}`
              : "No weekly plan yet"}
          </p>
        </div>

        <Link
          to="/weekly-plan"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          {currentPlan ? "Review weekly plan" : "Plan your week"}
        </Link>
      </div>
    </section>
  );
};

export default CurrentWeekCard;
