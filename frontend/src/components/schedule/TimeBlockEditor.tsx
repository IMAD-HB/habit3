import type { TimeBlock, TimeBlockStatus } from "../../types/timeBlock";

interface TimeBlockEditorProps {
  block: TimeBlock;
  isSaving: boolean;
  onChange: (block: TimeBlock) => void;
  onSave: () => void;
  onCancel: () => void;
}

const toDateTimeLocal = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const getActivityTitle = (block: TimeBlock) => {
  if (typeof block.activityId === "string") {
    return "Activity";
  }

  return block.activityId.title;
};

const TimeBlockEditor = ({
  block,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: TimeBlockEditorProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-time-block-title"
    >
      <div className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="edit-time-block-title"
              className="text-lg font-semibold text-slate-900"
            >
              Edit time block
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {getActivityTitle(block)}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close editor"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-time-block-start"
              className="block text-sm font-medium text-slate-700"
            >
              Start
            </label>

            <input
              id="edit-time-block-start"
              type="datetime-local"
              value={toDateTimeLocal(block.startAt)}
              onChange={(event) =>
                onChange({
                  ...block,
                  startAt: new Date(event.target.value).toISOString(),
                })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="edit-time-block-end"
              className="block text-sm font-medium text-slate-700"
            >
              End
            </label>

            <input
              id="edit-time-block-end"
              type="datetime-local"
              value={toDateTimeLocal(block.endAt)}
              onChange={(event) =>
                onChange({
                  ...block,
                  endAt: new Date(event.target.value).toISOString(),
                })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="edit-time-block-status"
              className="block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="edit-time-block-status"
              value={block.status}
              onChange={(event) =>
                onChange({
                  ...block,
                  status: event.target.value as TimeBlockStatus,
                })
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            >
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeBlockEditor;
