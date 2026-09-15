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

const TimeBlockEditor = ({
  block,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: TimeBlockEditorProps) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="space-y-3">
        <input
          type="datetime-local"
          value={toDateTimeLocal(block.startAt)}
          onChange={(event) =>
            onChange({
              ...block,
              startAt: new Date(event.target.value).toISOString(),
            })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />

        <input
          type="datetime-local"
          value={toDateTimeLocal(block.endAt)}
          onChange={(event) =>
            onChange({
              ...block,
              endAt: new Date(event.target.value).toISOString(),
            })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />

        <select
          value={block.status}
          onChange={(event) =>
            onChange({
              ...block,
              status: event.target.value as TimeBlockStatus,
            })
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="planned">Planned</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeBlockEditor;
