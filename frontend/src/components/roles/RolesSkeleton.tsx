const RolesSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
};

export default RolesSkeleton;
