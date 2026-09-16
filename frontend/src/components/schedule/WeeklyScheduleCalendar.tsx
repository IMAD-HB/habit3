import type { Activity } from "../../types/activity";
import type { TimeBlock } from "../../types/timeBlock";

interface WeeklyScheduleCalendarProps {
  weekDays: Date[];
  timeBlocks: TimeBlock[];
  onEditBlock: (block: TimeBlock) => void;
  onToggleComplete: (block: TimeBlock) => void;
  onToggleCancel: (block: TimeBlock) => void;
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

const WeeklyScheduleCalendar = ({
  weekDays,
  timeBlocks,
  onEditBlock,
  onToggleComplete,
  onToggleCancel,
}: WeeklyScheduleCalendarProps) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Weekly schedule</h2>

        <p className="mt-1 text-sm text-gray-500">
          Your protected time for this week's priorities.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {weekDays.map((day) => {
          const dayBlocks = timeBlocks.filter((block) =>
            isSameDay(block.startAt, day),
          );

          return (
            <div
              key={day.toISOString()}
              className="min-h-40 rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="border-b border-gray-200 pb-2">
                <p className="text-xs font-medium uppercase text-gray-500">
                  {day.toLocaleDateString([], {
                    weekday: "short",
                  })}
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {day.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="mt-3 space-y-2">
                {dayBlocks.length === 0 ? (
                  <p className="text-xs text-gray-400">No scheduled time</p>
                ) : (
                  dayBlocks.map((block) => {
                    const activity = getActivity(block.activityId);
                    const isCompleted = block.status === "completed";
                    const isCancelled = block.status === "cancelled";

                    return (
                      <div
                        key={block._id}
                        className={`rounded-lg border bg-white p-2 shadow-sm transition ${
                          isCancelled
                            ? "border-gray-200 bg-gray-100 opacity-70"
                            : isCompleted
                              ? "border-green-200 bg-green-50/50"
                              : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!isCancelled && (
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => onToggleComplete(block)}
                              onClick={(event) => event.stopPropagation()}
                              className="mt-0.5 h-4 w-4 shrink-0 accent-green-600"
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
                              className={`truncate text-sm font-medium ${
                                isCancelled
                                  ? "text-gray-400 line-through"
                                  : isCompleted
                                    ? "text-gray-500 line-through"
                                    : "text-gray-900"
                              }`}
                            >
                              {activity?.title ?? "Activity"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(block.startAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              —{" "}
                              {new Date(block.endAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>

                            <p className="mt-1 text-xs capitalize text-gray-400">
                              {block.status}
                            </p>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleCancel(block)}
                          className={`mt-2 text-xs font-medium transition ${
                            isCancelled
                              ? "text-blue-600 hover:text-blue-700"
                              : "text-red-600 hover:text-red-700"
                          }`}
                        >
                          {isCancelled ? "Restore block" : "Cancel block"}
                        </button>
                      </div>
                    );
                  })
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
