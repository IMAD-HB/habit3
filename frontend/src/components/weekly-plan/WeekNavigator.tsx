import type { WeeklyPlan } from "../../types/weeklyPlan";

interface WeekNavigatorProps {
  weekStart: string;
  weekEnd: string;
  formatDisplayDate: (date: string) => string;
  weeklyPlans: WeeklyPlan[];
  selectedCopyWeek: string;
  onCopyWeekChange: (weekStart: string) => void;
  onPrevious: () => void;
  onToday: () => void;
  onNext: () => void;
  onCopyWeek: () => void;
  isCopying: boolean;
}

const WeekNavigator = ({
  weekStart,
  weekEnd,
  formatDisplayDate,
  weeklyPlans,
  selectedCopyWeek,
  onCopyWeekChange,
  onPrevious,
  onToday,
  onNext,
  onCopyWeek,
  isCopying,
}: WeekNavigatorProps) => {
  const availableCopyPlans = weeklyPlans.filter(
    (plan) => plan.weekStart.slice(0, 10) !== weekStart,
  );

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">Planning week</p>

        <p className="mt-1 text-lg font-semibold text-gray-900">
          {formatDisplayDate(weekStart)} – {formatDisplayDate(weekEnd)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={onToday}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          This week
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>

        <div className="flex items-center gap-2">
          <select
            value={selectedCopyWeek}
            onChange={(event) => onCopyWeekChange(event.target.value)}
            disabled={availableCopyPlans.length === 0 || isCopying}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Select weekly plan to copy"
          >
            <option value="">Copy from...</option>

            {availableCopyPlans.map((plan) => (
              <option key={plan._id} value={plan.weekStart.slice(0, 10)}>
                {formatDisplayDate(plan.weekStart.slice(0, 10))}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onCopyWeek}
            disabled={!selectedCopyWeek || isCopying}
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCopying ? "Copying..." : "Copy"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default WeekNavigator;
