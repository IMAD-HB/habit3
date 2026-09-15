import type { Role } from "../../types/role";

interface ActivityFiltersProps {
  roles: Role[];
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
}

const ActivityFilters = ({
  roles,
  selectedRoleId,
  onRoleChange,
}: ActivityFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-slate-900">Your activities</h2>

      <select
        value={selectedRoleId}
        onChange={(event) => onRoleChange(event.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-900"
      >
        <option value="">All roles</option>

        {roles.map((role) => (
          <option key={role._id} value={role._id}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ActivityFilters;
