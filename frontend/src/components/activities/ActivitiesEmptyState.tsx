const ActivitiesEmptyState = () => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-slate-900">
        No activities yet
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create activities that move your important roles forward.
      </p>
    </div>
  );
};

export default ActivitiesEmptyState;
