const ActivitiesSkeleton = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
};

export default ActivitiesSkeleton;
