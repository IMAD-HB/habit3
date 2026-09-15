import { type FormEvent, useState } from "react";

import type {
  Activity,
  CreateActivityData,
  Quadrant,
} from "../../types/activity";
import type { Role } from "../../types/role";

interface ActivityFormProps {
  editingActivity: Activity | null;
  roles: Role[];
  isSubmitting: boolean;
  onSubmit: (data: CreateActivityData) => void;
  onCancel: () => void;
}

const quadrantLabels: Record<Quadrant, string> = {
  I: "Urgent & Important",
  II: "Important, Not Urgent",
  III: "Urgent, Not Important",
  IV: "Not Important",
};

const ActivityForm = ({
  editingActivity,
  roles,
  isSubmitting,
  onSubmit,
  onCancel,
}: ActivityFormProps) => {
  const getInitialRoleId = () => {
    if (editingActivity) {
      return typeof editingActivity.roleId === "string"
        ? editingActivity.roleId
        : editingActivity.roleId._id;
    }

    return roles[0]?._id ?? "";
  };

  const [roleId, setRoleId] = useState(getInitialRoleId);
  const [title, setTitle] = useState(editingActivity?.title ?? "");
  const [description, setDescription] = useState(
    editingActivity?.description ?? "",
  );
  const [quadrant, setQuadrant] = useState<Quadrant>(
    editingActivity?.quadrant ?? "II",
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    editingActivity?.estimatedDuration?.toString() ?? "",
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!roleId || !title.trim()) {
      return;
    }

    const duration = estimatedDuration ? Number(estimatedDuration) : undefined;

    const data: CreateActivityData = {
      roleId,
      title: title.trim(),
      description: description.trim() || undefined,
      quadrant,
      estimatedDuration: duration,
    };

    onSubmit(data);
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          {editingActivity ? "Edit activity" : "Create activity"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Turn your responsibilities into concrete activities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="activity-role"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Role
          </label>

          <select
            id="activity-role"
            value={roleId}
            onChange={(event) => setRoleId(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="">Select a role</option>

            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="activity-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Title
          </label>

          <input
            id="activity-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Study TypeScript"
            maxLength={200}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label
            htmlFor="activity-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="activity-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What does this activity involve?"
            maxLength={1000}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="activity-quadrant"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Quadrant
            </label>

            <select
              id="activity-quadrant"
              value={quadrant}
              onChange={(event) => setQuadrant(event.target.value as Quadrant)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              {Object.entries(quadrantLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {value} — {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="activity-duration"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Estimated duration (minutes)
            </label>

            <input
              id="activity-duration"
              type="number"
              min={1}
              value={estimatedDuration}
              onChange={(event) => setEstimatedDuration(event.target.value)}
              placeholder="e.g. 60"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
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
              : editingActivity
                ? "Save changes"
                : "Create activity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
