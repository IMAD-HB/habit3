import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import ActivityPriorityList from "../components/weekly-plan/ActivityPriorityList";
import WeeklyPlanEmptyState from "../components/weekly-plan/WeeklyPlanEmptyState";
import WeeklyPlanError from "../components/weekly-plan/WeeklyPlanError";
import WeeklyPlanHeader from "../components/weekly-plan/WeeklyPlanHeader";
import WeeklyPlanSkeleton from "../components/weekly-plan/WeeklyPlanSkeleton";
import WeeklyPrioritySummary from "../components/weekly-plan/WeeklyPrioritySummary";
import WeekNavigator from "../components/weekly-plan/WeekNavigator";

import { getActivities } from "../services/activityService";

import {
  createWeeklyPlan,
  deleteWeeklyPlan,
  getWeeklyPlans,
  updateWeeklyPlan,
} from "../services/weeklyPlanService";

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

const getWeekEnd = (weekStart: string) => {
  const date = new Date(`${weekStart}T00:00:00`);

  date.setDate(date.getDate() + 6);

  return formatDate(date);
};

const getPreviousWeekStart = (weekStart: string) => {
  const date = new Date(`${weekStart}T00:00:00`);

  date.setDate(date.getDate() - 7);

  return formatDate(date);
};

const formatDisplayDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const WeeklyPlanPage = () => {
  const queryClient = useQueryClient();

  const [weekStart, setWeekStart] = useState(() =>
    formatDate(getWeekStart(new Date())),
  );

  const [editedPriorities, setEditedPriorities] = useState<{
    weekStart: string;
    activityIds: string[];
  } | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const weeklyPlans = plansData?.data.weeklyPlans ?? [];
  const activities = activitiesData?.data.activities ?? [];

  const currentPlan = weeklyPlans.find(
    (plan) => plan.weekStart.slice(0, 10) === weekStart,
  );

  const previousWeekStart = getPreviousWeekStart(weekStart);

  const previousWeekPlan = weeklyPlans.find(
    (plan) => plan.weekStart.slice(0, 10) === previousWeekStart,
  );

  const savedPriorities =
    currentPlan?.priorities.map((activity) =>
      typeof activity === "string" ? activity : activity._id,
    ) ?? [];

  const selectedPriorities =
    editedPriorities?.weekStart === weekStart
      ? editedPriorities.activityIds
      : savedPriorities;

  const setSelectedPriorities = (activityIds: string[]) => {
    setEditedPriorities({
      weekStart,
      activityIds,
    });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createWeeklyPlan({
        weekStart,
        weekEnd: getWeekEnd(weekStart),
        priorities: selectedPriorities,
      }),

    onSuccess: () => {
      setEditedPriorities(null);

      queryClient.invalidateQueries({
        queryKey: ["weekly-plans"],
      });

      toast.success("Weekly plan created successfully.");
    },

    onError: () => {
      toast.error("Unable to create weekly plan.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!currentPlan) {
        throw new Error("Weekly plan not found.");
      }

      return updateWeeklyPlan(currentPlan._id, {
        weekStart,
        weekEnd: getWeekEnd(weekStart),
        priorities: selectedPriorities,
      });
    },

    onSuccess: () => {
      setEditedPriorities(null);

      queryClient.invalidateQueries({
        queryKey: ["weekly-plans"],
      });

      toast.success("Weekly plan updated successfully.");
    },

    onError: () => {
      toast.error("Unable to update weekly plan.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!currentPlan) {
        throw new Error("Weekly plan not found.");
      }

      return deleteWeeklyPlan(currentPlan._id);
    },

    onSuccess: () => {
      setEditedPriorities(null);
      setIsDeleteDialogOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["weekly-plans"],
      });

      toast.success("Weekly plan deleted successfully.");
    },

    onError: () => {
      toast.error("Unable to delete weekly plan.");
    },
  });

  const copyLastWeekMutation = useMutation({
    mutationFn: () => {
      if (!previousWeekPlan) {
        throw new Error("Previous weekly plan not found.");
      }

      const previousPriorities = previousWeekPlan.priorities.map((activity) =>
        typeof activity === "string" ? activity : activity._id,
      );

      if (currentPlan) {
        return updateWeeklyPlan(currentPlan._id, {
          weekStart,
          weekEnd: getWeekEnd(weekStart),
          priorities: previousPriorities,
        });
      }

      return createWeeklyPlan({
        weekStart,
        weekEnd: getWeekEnd(weekStart),
        priorities: previousPriorities,
      });
    },

    onSuccess: () => {
      setEditedPriorities(null);

      queryClient.invalidateQueries({
        queryKey: ["weekly-plans"],
      });

      toast.success("Last week's priorities copied successfully.");
    },

    onError: () => {
      toast.error("Unable to copy last week's plan.");
    },
  });

  const togglePriority = (activityId: string) => {
    const nextPriorities = selectedPriorities.includes(activityId)
      ? selectedPriorities.filter((id) => id !== activityId)
      : [...selectedPriorities, activityId];

    setSelectedPriorities(nextPriorities);
  };

  const handlePreviousWeek = () => {
    const date = new Date(`${weekStart}T00:00:00`);

    date.setDate(date.getDate() - 7);

    setWeekStart(formatDate(date));
    setEditedPriorities(null);
  };

  const handleNextWeek = () => {
    const date = new Date(`${weekStart}T00:00:00`);

    date.setDate(date.getDate() + 7);

    setWeekStart(formatDate(date));
    setEditedPriorities(null);
  };

  const handleToday = () => {
    setWeekStart(formatDate(getWeekStart(new Date())));
    setEditedPriorities(null);
  };

  const handleSave = () => {
    if (currentPlan) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleCopyLastWeek = () => {
    if (!previousWeekPlan) {
      return;
    }

    copyLastWeekMutation.mutate();
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isPlansLoading || isActivitiesLoading) {
    return <WeeklyPlanSkeleton />;
  }

  if (isPlansError || isActivitiesError) {
    return <WeeklyPlanError />;
  }

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <WeeklyPlanHeader />

        <WeekNavigator
          weekStart={weekStart}
          weekEnd={getWeekEnd(weekStart)}
          formatDisplayDate={formatDisplayDate}
          onPrevious={handlePreviousWeek}
          onToday={handleToday}
          onNext={handleNextWeek}
          onCopyLastWeek={handleCopyLastWeek}
          canCopyLastWeek={Boolean(previousWeekPlan)}
          isCopying={copyLastWeekMutation.isPending}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {activities.length === 0 ? (
            <WeeklyPlanEmptyState />
          ) : (
            <ActivityPriorityList
              activities={activities}
              selectedPriorities={selectedPriorities}
              onTogglePriority={togglePriority}
            />
          )}

          <WeeklyPrioritySummary
            activities={activities}
            selectedPriorities={selectedPriorities}
            isSaving={isSaving}
            hasCurrentPlan={Boolean(currentPlan)}
            isDeleting={deleteMutation.isPending}
            onTogglePriority={togglePriority}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-weekly-plan-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h2
                id="delete-weekly-plan-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete weekly plan?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Are you sure you want to delete the weekly plan for{" "}
                <span className="font-medium text-slate-900">
                  {formatDisplayDate(weekStart)}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeeklyPlanPage;
