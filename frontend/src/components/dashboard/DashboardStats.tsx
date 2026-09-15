interface DashboardStatsProps {
  priorityCount: number;
  completedPriorityCount: number;
  scheduledBlockCount: number;
  completedBlockCount: number;
  totalBlockCount: number;
  todayBlockCount: number;
}

const DashboardStats = ({
  priorityCount,
  completedPriorityCount,
  scheduledBlockCount,
  completedBlockCount,
  totalBlockCount,
  todayBlockCount,
}: DashboardStatsProps) => {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Weekly priorities</p>

        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {priorityCount}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {completedPriorityCount} completed
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Scheduled blocks</p>

        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {scheduledBlockCount}
        </p>

        <p className="mt-1 text-xs text-gray-500">for this week</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Activities completed</p>

        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {completedBlockCount}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          of {totalBlockCount} scheduled
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Today</p>

        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {todayBlockCount}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          scheduled time {todayBlockCount === 1 ? "block" : "blocks"}
        </p>
      </div>
    </section>
  );
};

export default DashboardStats;
