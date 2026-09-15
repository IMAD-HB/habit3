const WeeklyPlanSkeleton = () => {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-5 w-96 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    </main>
  );
};

export default WeeklyPlanSkeleton;
