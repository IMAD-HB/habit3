import type { FormEvent } from "react";

import type { Activity } from "../../types/activity";

interface SchedulePriorityFormProps {
  priorities: Activity[];
  selectedActivityId: string;
  startAt: string;
  endAt: string;
  isSubmitting: boolean;
  onActivityChange: (activityId: string) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const SchedulePriorityForm = ({
  priorities,
  selectedActivityId,
  startAt,
  endAt,
  isSubmitting,
  onActivityChange,
  onStartChange,
  onEndChange,
  onSubmit,
}: SchedulePriorityFormProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Schedule priority</h2>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority activity
          </label>

          <select
            value={selectedActivityId}
            onChange={(event) => onActivityChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select an activity</option>

            {priorities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start
          </label>

          <input
            type="datetime-local"
            value={startAt}
            onChange={(event) => onStartChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End</label>

          <input
            type="datetime-local"
            value={endAt}
            onChange={(event) => onEndChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "Scheduling..." : "Schedule activity"}
        </button>
      </form>
    </div>
  );
};

export default SchedulePriorityForm;
