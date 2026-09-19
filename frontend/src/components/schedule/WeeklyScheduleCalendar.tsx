import type { Activity } from "../../types/activity";
import type { TimeBlock } from "../../types/timeBlock";

interface WeeklyScheduleCalendarProps {
  weekDays: Date[];
  selectedDay: Date;
  timeBlocks: TimeBlock[];
  onSelectDay: (day: Date) => void;
  onEditBlock: (block: TimeBlock) => void;
  onToggleComplete: (block: TimeBlock) => void;
  onToggleCancel: (block: TimeBlock) => void;
  onDeleteBlock: (id: string) => void;
}

const isSameDay = (first: string, second: Date) => {
  const firstDate = new Date(first);

  return (
    firstDate.getFullYear() === second.getFullYear() &&
    firstDate.getMonth() === second.getMonth() &&
    firstDate.getDate() === second.getDate()
  );
};

const getActivity = (activityId: Activity | string) => {
  return typeof activityId === "string" ? null : activityId;
};

const formatTime = (value: string) => {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const sortTimeBlocks = (blocks: TimeBlock[]) => {
  return [...blocks].sort(
    (first, second) =>
      new Date(first.startAt).getTime() - new Date(second.startAt).getTime(),
  );
};

const getDayLabel = (day: Date) => {
  return day.toLocaleDateString([], {
    weekday: "short",
  });
};

const getDayNumber = (day: Date) => {
  return day.toLocaleDateString([], {
    day: "numeric",
  });
};

const getFullDayLabel = (day: Date) => {
  return day.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const TimeBlockCard = ({
  block,
  onEditBlock,
  onToggleComplete,
  onToggleCancel,
  onDeleteBlock,
}: {
  block: TimeBlock;
  onEditBlock: (block: TimeBlock) => void;
  onToggleComplete: (block: TimeBlock) => void;
  onToggleCancel: (block: TimeBlock) => void;
  onDeleteBlock: (id: string) => void;
}) => {
  const activity = getActivity(block.activityId);
  const isCompleted = block.status === "completed";
  const isCancelled = block.status === "cancelled";

  return (
    <div
      className={`rounded-xl border p-3 shadow-sm transition ${
        isCancelled
          ? "border-gray-200 bg-gray-100 opacity-70"
          : isCompleted
            ? "border-green-200 bg-green-50/50"
            : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {!isCancelled && (
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleComplete(block)}
            onClick={(event) => event.stopPropagation()}
            className="mt-1 h-4 w-4 shrink-0 accent-green-600"
            aria-label={`Mark ${
              activity?.title ?? "activity"
            } as ${isCompleted ? "incomplete" : "completed"}`}
          />
        )}

        <button
          type="button"
          onClick={() => onEditBlock(block)}
          className="min-w-0 flex-1 text-left"
        >
          <p
            className={`wrap-break-word text-sm font-medium leading-5 ${
              isCancelled
                ? "text-gray-400 line-through"
                : isCompleted
                  ? "text-gray-500 line-through"
                  : "text-gray-900"
            }`}
          >
            {activity?.title ?? "Activity"}
          </p>

          <p className="mt-1.5 text-xs text-gray-500">
            {formatTime(block.startAt)} — {formatTime(block.endAt)}
          </p>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => onEditBlock(block)}
          className="text-xs font-medium text-gray-600 transition hover:text-gray-900"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onToggleCancel(block)}
          className={`text-xs font-medium transition ${
            isCancelled
              ? "text-blue-600 hover:text-blue-700"
              : "text-red-600 hover:text-red-700"
          }`}
        >
          {isCancelled ? "Restore" : "Cancel"}
        </button>

        <button
          type="button"
          onClick={() => onDeleteBlock(block._id)}
          className="text-xs font-medium text-red-600 transition hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const WeeklyScheduleCalendar = ({
  weekDays,
  selectedDay,
  timeBlocks,
  onSelectDay,
  onEditBlock,
  onToggleComplete,
  onToggleCancel,
  onDeleteBlock,
}: WeeklyScheduleCalendarProps) => {
  const selectedDayBlocks = sortTimeBlocks(
    timeBlocks.filter((block) => isSameDay(block.startAt, selectedDay)),
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Weekly schedule</h2>

        <p className="mt-1 text-sm text-gray-500">
          Your protected time for this week's priorities.
        </p>
      </div>

      {/* Mobile day selector */}
      <div className="mt-5 overflow-x-auto pb-1 sm:hidden">
        <div className="flex min-w-max gap-2">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day.toISOString(), selectedDay);

            const dayBlockCount = timeBlocks.filter((block) =>
              isSameDay(block.startAt, day),
            ).length;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => onSelectDay(day)}
                className={`flex min-w-14 flex-col items-center rounded-xl border px-3 py-2.5 transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="text-[11px] font-medium uppercase">
                  {getDayLabel(day)}
                </span>

                <span className="mt-1 text-lg font-semibold">
                  {getDayNumber(day)}
                </span>

                <span
                  className={`mt-1 text-[10px] ${
                    isSelected ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {dayBlockCount} {dayBlockCount === 1 ? "block" : "blocks"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile selected day */}
      <div className="mt-5 sm:hidden">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900">
            {getFullDayLabel(selectedDay)}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            {selectedDayBlocks.length}{" "}
            {selectedDayBlocks.length === 1
              ? "scheduled block"
              : "scheduled blocks"}
          </p>
        </div>

        {selectedDayBlocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-sm font-medium text-gray-700">
              No scheduled time
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Add a time block for this day.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayBlocks.map((block) => (
              <TimeBlockCard
                key={block._id}
                block={block}
                onEditBlock={onEditBlock}
                onToggleComplete={onToggleComplete}
                onToggleCancel={onToggleCancel}
                onDeleteBlock={onDeleteBlock}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop weekly overview */}
      <div className="mt-6 hidden sm:grid sm:grid-cols-7">
        {weekDays.map((day, index) => {
          const dayBlocks = sortTimeBlocks(
            timeBlocks.filter((block) => isSameDay(block.startAt, day)),
          );

          const isSelected = isSameDay(day.toISOString(), selectedDay);

          return (
            <div
              key={day.toISOString()}
              className={`min-w-0 ${
                index > 0 ? "border-l border-gray-200" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectDay(day)}
                className={`w-full border-b border-gray-200 px-3 py-3 text-center transition ${
                  isSelected ? "bg-gray-50" : "hover:bg-gray-50/70"
                }`}
              >
                <p className="text-xs font-medium uppercase text-gray-500">
                  {day.toLocaleDateString([], {
                    weekday: "short",
                  })}
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {day.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  {dayBlocks.length}{" "}
                  {dayBlocks.length === 1 ? "block" : "blocks"}
                </p>
              </button>

              <div className="min-h-72 space-y-2 bg-gray-50/50 p-2">
                {dayBlocks.length === 0 ? (
                  <p className="px-1 py-3 text-center text-[11px] text-gray-400">
                    No scheduled time
                  </p>
                ) : (
                  dayBlocks.map((block) => (
                    <TimeBlockCard
                      key={block._id}
                      block={block}
                      onEditBlock={onEditBlock}
                      onToggleComplete={onToggleComplete}
                      onToggleCancel={onToggleCancel}
                      onDeleteBlock={onDeleteBlock}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyScheduleCalendar;
