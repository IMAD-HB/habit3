interface ActivitiesHeaderProps {
  isCreating: boolean;
  isEditing: boolean;
  hasRoles: boolean;
  onCreate: () => void;
}

const ActivitiesHeader = ({
  isCreating,
  isEditing,
  hasRoles,
  onCreate,
}: ActivitiesHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-500">Habit 3</p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Activities
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Define the important activities that support each role.
        </p>
      </div>

      {!isCreating && !isEditing && (
        <button
          type="button"
          onClick={onCreate}
          disabled={!hasRoles}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add activity
        </button>
      )}
    </div>
  );
};

export default ActivitiesHeader;
