import { useMemo, useState, type FormEvent } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import CurrentPlanCard from "../components/schedule/CurrentPlanCard";
import ScheduleError from "../components/schedule/ScheduleError";
import ScheduleHeader from "../components/schedule/ScheduleHeader";
import ScheduleLoading from "../components/schedule/ScheduleLoading";
import ScheduleNoPlan from "../components/schedule/ScheduleNoPlan";
import SchedulePriorityForm from "../components/schedule/SchedulePriorityForm";
import ScheduledTimeList from "../components/schedule/ScheduledTimeList";
import WeeklyPlanSelector from "../components/schedule/WeeklyPlanSelector";
import WeeklyScheduleCalendar from "../components/schedule/WeeklyScheduleCalendar";

import {
  copyPreviousWeekSchedule,
  createTimeBlock,
  deleteTimeBlock,
  getTimeBlocks,
  updateTimeBlock,
} from "../services/timeBlockService";
import { getWeeklyPlans } from "../services/weeklyPlanService";

import type {
  CreateTimeBlockData,
  TimeBlock,
  TimeBlockStatus,
} from "../types/timeBlock";

const getWeekDays = (weekStart: string, weekEnd: string) => {
  const start = new Date(`${weekStart.slice(0, 10)}T00:00:00`);
  const end = new Date(`${weekEnd.slice(0, 10)}T00:00:00`);

  const days: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDisplayDate = (date: string) => {
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const SchedulePage = () => {
  const queryClient = useQueryClient();

  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [blockToDelete, setBlockToDelete] = useState<TimeBlock | null>(null);
  const [blockToCopy, setBlockToCopy] = useState<TimeBlock | null>(null);
  const [copyTargetDate, setCopyTargetDate] = useState("");
  const [selectedCopyWeek, setSelectedCopyWeek] = useState("");

  const weeklyPlansQuery = useQuery({
    queryKey: ["weekly-plans"],
    queryFn: getWeeklyPlans,
  });

  const weeklyPlans = useMemo(
    () => weeklyPlansQuery.data?.data.weeklyPlans ?? [],
    [weeklyPlansQuery.data],
  );

  const activePlanId = selectedPlanId || weeklyPlans[0]?._id || "";

  const activePlan = useMemo(
    () => weeklyPlans.find((plan) => plan._id === activePlanId),
    [weeklyPlans, activePlanId],
  );

  const availableCopyPlans = useMemo(
    () => weeklyPlans.filter((plan) => plan._id !== activePlanId),
    [weeklyPlans, activePlanId],
  );

  const timeBlocksQuery = useQuery({
    queryKey: ["time-blocks", activePlanId],
    queryFn: () => getTimeBlocks(activePlanId),
    enabled: Boolean(activePlanId),
  });

  const timeBlocks: TimeBlock[] = timeBlocksQuery.data?.data.timeBlocks ?? [];

  const weekDays = useMemo(
    () =>
      activePlan ? getWeekDays(activePlan.weekStart, activePlan.weekEnd) : [],
    [activePlan],
  );

  const createMutation = useMutation({
    mutationFn: (data: CreateTimeBlockData) => createTimeBlock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["time-blocks", activePlanId],
      });

      setSelectedActivityId("");
      setStartAt("");
      setEndAt("");

      toast.success("Time block created successfully.");
    },
    onError: () => {
      toast.error("Unable to create time block.");
    },
  });

  const copyWeekMutation = useMutation({
    mutationFn: ({
      sourceWeeklyPlanId,
      targetWeeklyPlanId,
    }: {
      sourceWeeklyPlanId: string;
      targetWeeklyPlanId: string;
    }) =>
      copyPreviousWeekSchedule({
        sourceWeeklyPlanId,
        targetWeeklyPlanId,
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["time-blocks", activePlanId],
      });

      const copiedCount = response.data.copiedBlocks.length;
      const skippedCount = response.data.skippedBlocks.length;

      if (skippedCount === 0) {
        toast.success(
          `${copiedCount} time block${
            copiedCount === 1 ? "" : "s"
          } copied successfully.`,
        );
      } else {
        toast.success(
          `${copiedCount} time block${
            copiedCount === 1 ? "" : "s"
          } copied. ${skippedCount} skipped.`,
        );
      }

      setSelectedCopyWeek("");
    },
    onError: () => {
      toast.error("Unable to copy weekly schedule.");
    },
  });

  const copyMutation = useMutation({
    mutationFn: (data: CreateTimeBlockData) => createTimeBlock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["time-blocks", activePlanId],
      });

      setBlockToCopy(null);
      setCopyTargetDate("");

      toast.success("Time block copied successfully.");
    },
    onError: () => {
      toast.error("Unable to copy time block.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        startAt?: string;
        endAt?: string;
        status?: TimeBlockStatus;
      };
    }) => updateTimeBlock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["time-blocks", activePlanId],
      });

      setEditingBlock(null);

      toast.success("Time block updated successfully.");
    },
    onError: () => {
      toast.error("Unable to update time block.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTimeBlock,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["time-blocks", activePlanId],
      });

      setBlockToDelete(null);

      toast.success("Time block deleted successfully.");
    },
    onError: () => {
      toast.error("Unable to delete time block.");
    },
  });

  const handleCopyWeek = () => {
    if (!activePlan || !selectedCopyWeek) {
      return;
    }

    const sourcePlan = weeklyPlans.find(
      (plan) => plan._id === selectedCopyWeek,
    );

    if (!sourcePlan) {
      toast.error("Source weekly plan not found.");
      return;
    }

    copyWeekMutation.mutate({
      sourceWeeklyPlanId: sourcePlan._id,
      targetWeeklyPlanId: activePlan._id,
    });
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activePlanId || !selectedActivityId || !startAt || !endAt) {
      return;
    }

    createMutation.mutate({
      weeklyPlanId: activePlanId,
      activityId: selectedActivityId,
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      status: "planned",
    });
  };

  const handleCopy = (block: TimeBlock) => {
    setBlockToCopy(block);
    setCopyTargetDate("");
  };

  const confirmCopy = () => {
    if (!blockToCopy || !copyTargetDate || !activePlanId) {
      return;
    }

    const originalStart = new Date(blockToCopy.startAt);
    const originalEnd = new Date(blockToCopy.endAt);

    const duration = originalEnd.getTime() - originalStart.getTime();

    const targetStart = new Date(
      `${copyTargetDate}T${String(originalStart.getHours()).padStart(
        2,
        "0",
      )}:${String(originalStart.getMinutes()).padStart(2, "0")}`,
    );

    const targetEnd = new Date(targetStart.getTime() + duration);

    const activityId =
      typeof blockToCopy.activityId === "string"
        ? blockToCopy.activityId
        : blockToCopy.activityId._id;

    copyMutation.mutate({
      weeklyPlanId: activePlanId,
      activityId,
      startAt: targetStart.toISOString(),
      endAt: targetEnd.toISOString(),
      status: "planned",
    });
  };

  const handleEdit = (block: TimeBlock) => {
    setEditingBlock(block);
  };

  const handleSaveEdit = () => {
    if (!editingBlock) {
      return;
    }

    updateMutation.mutate({
      id: editingBlock._id,
      data: {
        startAt: new Date(editingBlock.startAt).toISOString(),
        endAt: new Date(editingBlock.endAt).toISOString(),
        status: editingBlock.status,
      },
    });
  };

  const handleToggleComplete = (block: TimeBlock) => {
    const nextStatus: TimeBlockStatus =
      block.status === "completed" ? "planned" : "completed";

    updateMutation.mutate({
      id: block._id,
      data: {
        status: nextStatus,
      },
    });
  };

  const handleDelete = (id: string) => {
    const block = timeBlocks.find((timeBlock) => timeBlock._id === id);

    if (!block) {
      return;
    }

    setBlockToDelete(block);
  };

  const confirmDelete = () => {
    if (!blockToDelete) {
      return;
    }

    deleteMutation.mutate(blockToDelete._id);
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    setSelectedActivityId("");
    setEditingBlock(null);
    setBlockToDelete(null);
    setBlockToCopy(null);
    setCopyTargetDate("");
    setSelectedCopyWeek("");
  };

  if (weeklyPlansQuery.isLoading) {
    return <ScheduleLoading />;
  }

  if (weeklyPlansQuery.isError) {
    return <ScheduleError />;
  }

  if (weeklyPlans.length === 0) {
    return <ScheduleNoPlan />;
  }

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <ScheduleHeader hasPlan={true} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <WeeklyPlanSelector
            weeklyPlans={weeklyPlans}
            activePlanId={activePlanId}
            onChange={handlePlanChange}
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={selectedCopyWeek}
              onChange={(event) => setSelectedCopyWeek(event.target.value)}
              disabled={
                availableCopyPlans.length === 0 || copyWeekMutation.isPending
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition hover:bg-gray-50 focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Copy from...</option>

              {availableCopyPlans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {formatDisplayDate(plan.weekStart)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCopyWeek}
              disabled={!selectedCopyWeek || copyWeekMutation.isPending}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copyWeekMutation.isPending
                ? "Copying schedule..."
                : "Copy schedule"}
            </button>
          </div>
        </div>

        {activePlan && (
          <>
            <CurrentPlanCard
              plan={activePlan}
              selectedActivityId={selectedActivityId}
              onSelectActivity={setSelectedActivityId}
            />

            <WeeklyScheduleCalendar
              weekDays={weekDays}
              timeBlocks={timeBlocks}
              onEditBlock={handleEdit}
              onToggleComplete={handleToggleComplete}
            />

            <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <SchedulePriorityForm
                priorities={activePlan.priorities}
                selectedActivityId={selectedActivityId}
                startAt={startAt}
                endAt={endAt}
                isSubmitting={createMutation.isPending}
                onActivityChange={setSelectedActivityId}
                onStartChange={setStartAt}
                onEndChange={setEndAt}
                onSubmit={handleCreate}
              />

              <ScheduledTimeList
                timeBlocks={timeBlocks}
                isLoading={timeBlocksQuery.isLoading}
                editingBlock={editingBlock}
                isSaving={updateMutation.isPending}
                isDeleting={deleteMutation.isPending}
                onEdit={handleEdit}
                onCopy={handleCopy}
                onEditChange={setEditingBlock}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingBlock(null)}
                onDelete={handleDelete}
              />
            </section>
          </>
        )}
      </main>

      {blockToCopy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="copy-time-block-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h2
                id="copy-time-block-title"
                className="text-lg font-semibold text-slate-900"
              >
                Copy time block
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Copy this scheduled activity to another day.
              </p>

              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                {formatDateTime(blockToCopy.startAt)} —{" "}
                {new Date(blockToCopy.endAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <label
              htmlFor="copy-target-date"
              className="block text-sm font-medium text-slate-700"
            >
              Copy to
            </label>

            <select
              id="copy-target-date"
              value={copyTargetDate}
              onChange={(event) => setCopyTargetDate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Select a day</option>

              {weekDays
                .filter(
                  (day) =>
                    getDateKey(day) !==
                    getDateKey(new Date(blockToCopy.startAt)),
                )
                .map((day) => (
                  <option key={getDateKey(day)} value={getDateKey(day)}>
                    {day.toLocaleDateString([], {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </option>
                ))}
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setBlockToCopy(null);
                  setCopyTargetDate("");
                }}
                disabled={copyMutation.isPending}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmCopy}
                disabled={!copyTargetDate || copyMutation.isPending}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copyMutation.isPending ? "Copying..." : "Copy block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {blockToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-time-block-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5">
              <h2
                id="delete-time-block-title"
                className="text-lg font-semibold text-slate-900"
              >
                Delete time block?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Are you sure you want to delete this scheduled time block?
              </p>

              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600">
                {formatDateTime(blockToDelete.startAt)} —{" "}
                {new Date(blockToDelete.endAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setBlockToDelete(null)}
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
                {deleteMutation.isPending ? "Deleting..." : "Delete block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SchedulePage;
