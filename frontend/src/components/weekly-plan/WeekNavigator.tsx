interface WeekNavigatorProps {
  weekStart: string;
  weekEnd: string;
  formatDisplayDate: (date: string) => string;
  onPrevious: () => void;
  onToday: () => void;
  onNext: () => void;
  onCopyLastWeek: () => void;
  canCopyLastWeek: boolean;
  isCopying: boolean;
}

const WeekNavigator = ({
  weekStart,
  weekEnd,
  formatDisplayDate,
  onPrevious,
  onToday,
  onNext,
  onCopyLastWeek,
  canCopyLastWeek,
  isCopying,
}: WeekNavigatorProps) => {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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

        <button
          type="button"
          onClick={onCopyLastWeek}
          disabled={!canCopyLastWeek || isCopying}
          className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCopying ? "Copying..." : "Copy last week"}
        </button>
      </div>
    </section>
  );
};

export default WeekNavigator;
