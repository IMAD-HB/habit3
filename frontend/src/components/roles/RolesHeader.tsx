interface RolesHeaderProps {
  isCreating: boolean;
  isEditing: boolean;
  onCreate: () => void;
}

const RolesHeader = ({ isCreating, isEditing, onCreate }: RolesHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-500">Habit 3</p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Roles
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Define the important roles you want to live intentionally.
        </p>
      </div>

      {!isCreating && !isEditing && (
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add role
        </button>
      )}
    </div>
  );
};

export default RolesHeader;
