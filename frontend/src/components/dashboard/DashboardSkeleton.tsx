const DashboardSkeleton = () => {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />

        <div className="h-5 w-96 max-w-full animate-pulse rounded-lg bg-gray-200" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    </main>
  );
};

export default DashboardSkeleton;
