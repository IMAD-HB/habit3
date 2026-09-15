const WeeklyPlanEmptyState = () => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <h3 className="font-medium text-gray-900">No activities yet</h3>

      <p className="mt-1 text-sm text-gray-500">
        Create activities first, then return here to choose your weekly
        priorities.
      </p>
    </div>
  );
};

export default WeeklyPlanEmptyState;
