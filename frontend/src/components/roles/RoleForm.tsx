import { type FormEvent, useState } from "react";

import type { CreateRoleData, Role } from "../../types/role";

interface RoleFormProps {
  editingRole: Role | null;
  isSubmitting: boolean;
  onSubmit: (data: CreateRoleData) => void;
  onCancel: () => void;
}

const RoleForm = ({
  editingRole,
  isSubmitting,
  onSubmit,
  onCancel,
}: RoleFormProps) => {
  const [name, setName] = useState(editingRole?.name ?? "");
  const [description, setDescription] = useState(
    editingRole?.description ?? "",
  );
  const [color, setColor] = useState(editingRole?.color ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: CreateRoleData = {
      name: name.trim(),
      description: description.trim() || undefined,
      color: color.trim() || undefined,
    };

    if (!data.name) {
      return;
    }

    onSubmit(data);
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingRole ? "Edit role" : "Create role"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {editingRole
            ? "Update the role details."
            : "Add a role that matters in your life."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="role-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Name
          </label>

          <input
            id="role-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Student"
            maxLength={100}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="role-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="role-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What does this role mean to you?"
            maxLength={500}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="role-color"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Color
          </label>

          <input
            id="role-color"
            type="text"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            placeholder="e.g. #3b82f6"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : editingRole
                ? "Save changes"
                : "Create role"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
