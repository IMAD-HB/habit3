interface RolesEmptyStateProps {
  onCreate: () => void;
}

const RolesEmptyState = ({ onCreate }: RolesEmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-slate-900">No roles yet</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start by identifying the roles that matter most to you.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Create your first role
      </button>
    </div>
  );
};

export default RolesEmptyState;
