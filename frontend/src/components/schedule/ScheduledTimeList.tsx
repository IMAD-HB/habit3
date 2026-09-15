import type { Activity } from "../../types/activity";
import type { TimeBlock } from "../../types/timeBlock";

import TimeBlockEditor from "./TimeBlockEditor";

interface ScheduledTimeListProps {
  timeBlocks: TimeBlock[];
  isLoading: boolean;
  editingBlock: TimeBlock | null;
  isSaving: boolean;
  isDeleting: boolean;
  onEdit: (block: TimeBlock) => void;
  onEditChange: (block: TimeBlock) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActivity = (activityId: Activity | string) => {
  return typeof activityId === "string" ? null : activityId;
};

const ScheduledTimeList = ({
  timeBlocks,
  isLoading,
  editingBlock,
  isSaving,
  isDeleting,
  onEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: ScheduledTimeListProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Scheduled time</h2>

          <p className="mt-1 text-sm text-gray-500">
            {timeBlocks.length} time block
            {timeBlocks.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-500">Loading schedule...</p>
      ) : timeBlocks.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No time blocks scheduled yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {timeBlocks.map((block) => {
            const activity = getActivity(block.activityId);

            if (editingBlock?._id === block._id) {
              return (
                <TimeBlockEditor
                  key={block._id}
                  block={editingBlock}
                  isSaving={isSaving}
                  onChange={onEditChange}
                  onSave={onSaveEdit}
                  onCancel={onCancelEdit}
                />
              );
            }

            return (
              <div
                key={block._id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">
                      {activity?.title ?? "Activity"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatDateTime(block.startAt)} —{" "}
                      {formatDateTime(block.endAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize">
                    {block.status}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(block)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(block._id)}
                    disabled={isDeleting}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduledTimeList;
