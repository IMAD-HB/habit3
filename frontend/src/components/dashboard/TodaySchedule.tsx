import { Link } from "react-router-dom";

import type { Activity } from "../../types/activity";
import type { TimeBlock } from "../../types/timeBlock";

interface TodayScheduleProps {
  timeBlocks: TimeBlock[];
  getActivity: (activityId: Activity | string) => Activity | null;
  formatTime: (date: string) => string;
}

const TodaySchedule = ({
  timeBlocks,
  getActivity,
  formatTime,
}: TodayScheduleProps) => {
  return (
    <section className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900">Today's schedule</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your protected time for today.
          </p>
        </div>

        <Link
          to="/schedule"
          className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
        >
          View schedule
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {timeBlocks.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-5 text-center">
            <p className="text-sm font-medium text-gray-900">
              Nothing scheduled today
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Protect time for one of your priorities.
            </p>

            <Link
              to="/schedule"
              className="mt-4 inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-white"
            >
              Open schedule
            </Link>
          </div>
        ) : (
          timeBlocks.map((block) => {
            const activity = getActivity(block.activityId);

            return (
              <div
                key={block._id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity?.title ?? "Activity"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatTime(block.startAt)} – {formatTime(block.endAt)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                      block.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : block.status === "cancelled"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {block.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default TodaySchedule;
