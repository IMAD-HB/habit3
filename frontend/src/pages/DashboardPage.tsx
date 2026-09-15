import { useMemo } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import DashboardError from "../components/dashboard/DashboardError";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import DashboardStats from "../components/dashboard/DashboardStats";
import CurrentWeekCard from "../components/dashboard/CurrentWeekCard";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import WeeklyPriorities from "../components/dashboard/WeeklyPriorities";

import { getActivities, updateActivity } from "../services/activityService";
import { getTimeBlocks } from "../services/timeBlockService";
import { getWeeklyPlans } from "../services/weeklyPlanService";

import type { Activity, Quadrant } from "../types/activity";

const getWeekStart = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();

  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);

  return result;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: string) => {
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const quadrantLabels: Record<Quadrant, string> = {
  I: "Urgent & Important",
  II: "Important",
  III: "Urgent",
  IV: "Neither",
};

const quadrantClasses: Record<Quadrant, string> = {
  I: "bg-red-100 text-red-700",
  II: "bg-blue-100 text-blue-700",
  III: "bg-yellow-100 text-yellow-700",
  IV: "bg-gray-100 text-gray-600",
};

const getActivity = (activityId: Activity | string) => {
  return typeof activityId === "string" ? null : activityId;
};

const DashboardPage = () => {
  const queryClient = useQueryClient();

  const {
    data: plansData,
    isLoading: isPlansLoading,
    isError: isPlansError,
  } = useQuery({
    queryKey: ["weekly-plans"],
    queryFn: getWeeklyPlans,
  });

  const {
    data: activitiesData,
    isLoading: isActivitiesLoading,
    isError: isActivitiesError,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
  });

  const {
    data: timeBlocksData,
    isLoading: isTimeBlocksLoading,
    isError: isTimeBlocksError,
  } = useQuery({
    queryKey: ["time-blocks"],
    queryFn: () => getTimeBlocks(),
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateActivity(id, { completed }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      queryClient.invalidateQueries({
        queryKey: ["weekly-plans"],
      });

      toast.success(
        variables.completed
          ? "Activity marked as completed."
          : "Activity marked as incomplete.",
      );
    },

    onError: () => {
      toast.error("Unable to update activity.");
    },
  });

  const weeklyPlans = useMemo(
    () => plansData?.data.weeklyPlans ?? [],
    [plansData],
  );

  const activities = useMemo(
    () => activitiesData?.data.activities ?? [],
    [activitiesData],
  );

  const timeBlocks = useMemo(
    () => timeBlocksData?.data.timeBlocks ?? [],
    [timeBlocksData],
  );

  const currentWeekStart = formatDate(getWeekStart(new Date()));

  const currentPlan = useMemo(
    () =>
      weeklyPlans.find(
        (plan) => plan.weekStart.slice(0, 10) === currentWeekStart,
      ),
    [weeklyPlans, currentWeekStart],
  );

  const priorities = currentPlan?.priorities ?? [];

  const completedActivities = activities.filter(
    (activity) => activity.completed,
  );

  const todaysTimeBlocks = useMemo(() => {
    const today = new Date();

    return timeBlocks
      .filter((block) => {
        const start = new Date(block.startAt);

        return (
          start.getFullYear() === today.getFullYear() &&
          start.getMonth() === today.getMonth() &&
          start.getDate() === today.getDate()
        );
      })
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
  }, [timeBlocks]);

  const scheduledTimeBlocks = currentPlan
    ? timeBlocks.filter((block) => block.weeklyPlanId === currentPlan._id)
    : [];

  const completedPriorityCount = priorities.filter(
    (priority) => priority.completed,
  ).length;

  const isLoading =
    isPlansLoading || isActivitiesLoading || isTimeBlocksLoading;

  const isError = isPlansError || isActivitiesError || isTimeBlocksError;

  const handleToggleComplete = (activity: Activity) => {
    updateActivityMutation.mutate({
      id: activity._id,
      completed: !activity.completed,
    });
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardError />;
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <DashboardHeader />

      <CurrentWeekCard
        currentPlan={currentPlan}
        formatDisplayDate={formatDisplayDate}
      />

      <DashboardStats
        priorityCount={priorities.length}
        completedPriorityCount={completedPriorityCount}
        scheduledBlockCount={scheduledTimeBlocks.length}
        completedActivityCount={completedActivities.length}
        totalActivityCount={activities.length}
        todayBlockCount={todaysTimeBlocks.length}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <WeeklyPriorities
          priorities={priorities}
          quadrantLabels={quadrantLabels}
          quadrantClasses={quadrantClasses}
          onToggleComplete={handleToggleComplete}
          isUpdating={updateActivityMutation.isPending}
        />

        <TodaySchedule
          timeBlocks={todaysTimeBlocks}
          getActivity={getActivity}
          formatTime={formatTime}
        />
      </div>
    </main>
  );
};

export default DashboardPage;
