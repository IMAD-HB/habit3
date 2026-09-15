import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.js";

import Activity from "../models/Activity.js";

import TimeBlock from "../models/TimeBlock.js";

import WeeklyPlan from "../models/WeeklyPlan.js";

const getWeeklyPlanEndBoundary = (weekEnd: Date) => {
  const endBoundary = new Date(weekEnd);
  endBoundary.setDate(endBoundary.getDate() + 1);
  return endBoundary;
};

export const createTimeBlock = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const userId = req.userId!;

  const {
    weeklyPlanId,
    activityId,
    startAt,
    endAt,
    status = "planned",
  } = req.body;

  const weeklyPlan = await WeeklyPlan.findById(weeklyPlanId);

  if (!weeklyPlan || weeklyPlan.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Weekly plan not found",
    });
    return;
  }

  const activity = await Activity.findById(activityId);

  if (!activity || activity.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Activity not found",
    });
    return;
  }

  const isPriority = weeklyPlan.priorities.some(
    (priorityId) => priorityId.toString() === activityId,
  );

  if (!isPriority) {
    res.status(400).json({
      success: false,
      message: "Activity is not a priority of this weekly plan",
    });
    return;
  }

  const parsedStartAt = new Date(startAt);
  const parsedEndAt = new Date(endAt);

  if (
    Number.isNaN(parsedStartAt.getTime()) ||
    Number.isNaN(parsedEndAt.getTime())
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid startAt or endAt",
    });
    return;
  }

  if (parsedEndAt <= parsedStartAt) {
    res.status(400).json({
      success: false,
      message: "endAt must be after startAt",
    });
    return;
  }

  const weekEndBoundary = getWeeklyPlanEndBoundary(weeklyPlan.weekEnd);

  if (parsedStartAt < weeklyPlan.weekStart || parsedEndAt > weekEndBoundary) {
    res.status(400).json({
      success: false,
      message: "Time block must be within the weekly plan dates",
    });
    return;
  }

  const existingBlocks = await TimeBlock.find({
    userId,
    status: { $ne: "cancelled" },
  });

  const hasOverlap = existingBlocks.some(
    (block) => block.startAt < parsedEndAt && block.endAt > parsedStartAt,
  );

  if (hasOverlap) {
    res.status(409).json({
      success: false,
      message: "Time block overlaps with another scheduled block",
    });
    return;
  }

  const timeBlock = await TimeBlock.create({
    userId,
    weeklyPlanId,
    activityId,
    startAt: parsedStartAt,
    endAt: parsedEndAt,
    status,
  });

  await timeBlock.populate([
    {
      path: "activityId",
      select: "title description quadrant estimatedDuration completed roleId",
      populate: {
        path: "roleId",
        select: "name color order",
      },
    },
    {
      path: "weeklyPlanId",
      select: "weekStart weekEnd",
    },
  ]);

  res.status(201).json({
    success: true,
    data: {
      timeBlock,
    },
  });
};

export const copyPreviousWeekSchedule = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const userId = req.userId!;

  const { sourceWeeklyPlanId, targetWeeklyPlanId } = req.body;

  if (sourceWeeklyPlanId === targetWeeklyPlanId) {
    res.status(400).json({
      success: false,
      message: "Source and target weekly plans must be different",
    });
    return;
  }

  const [sourcePlan, targetPlan] = await Promise.all([
    WeeklyPlan.findById(sourceWeeklyPlanId),
    WeeklyPlan.findById(targetWeeklyPlanId),
  ]);

  if (!sourcePlan || sourcePlan.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Source weekly plan not found",
    });
    return;
  }

  if (!targetPlan || targetPlan.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Target weekly plan not found",
    });
    return;
  }

  const sourceBlocks = await TimeBlock.find({
    userId,
    weeklyPlanId: sourcePlan._id,
  }).sort({ startAt: 1 });

  const currentPriorityIds = new Set(
    targetPlan.priorities.map((priorityId) => priorityId.toString()),
  );

  const existingTargetBlocks = await TimeBlock.find({
    userId,
    weeklyPlanId: targetPlan._id,
    status: { $ne: "cancelled" },
  });

  const copiedBlocks = [];
  const skippedBlocks: {
    timeBlockId: string;
    reason: "not_current_priority" | "overlap";
  }[] = [];

  const targetWeekEndBoundary = getWeeklyPlanEndBoundary(targetPlan.weekEnd);

  for (const sourceBlock of sourceBlocks) {
    const activityId = sourceBlock.activityId.toString();

    if (!currentPriorityIds.has(activityId)) {
      skippedBlocks.push({
        timeBlockId: sourceBlock._id.toString(),
        reason: "not_current_priority",
      });

      continue;
    }

    const offsetFromWeekStart =
      sourceBlock.startAt.getTime() - sourcePlan.weekStart.getTime();

    const duration =
      sourceBlock.endAt.getTime() - sourceBlock.startAt.getTime();

    const targetStartAt = new Date(
      targetPlan.weekStart.getTime() + offsetFromWeekStart,
    );

    const targetEndAt = new Date(targetStartAt.getTime() + duration);

    if (
      targetStartAt < targetPlan.weekStart ||
      targetEndAt > targetWeekEndBoundary
    ) {
      skippedBlocks.push({
        timeBlockId: sourceBlock._id.toString(),
        reason: "overlap",
      });

      continue;
    }

    const hasOverlap = existingTargetBlocks.some(
      (block) => block.startAt < targetEndAt && block.endAt > targetStartAt,
    );

    if (hasOverlap) {
      skippedBlocks.push({
        timeBlockId: sourceBlock._id.toString(),
        reason: "overlap",
      });

      continue;
    }

    const copiedBlock = await TimeBlock.create({
      userId,
      weeklyPlanId: targetPlan._id,
      activityId: sourceBlock.activityId,
      startAt: targetStartAt,
      endAt: targetEndAt,
      status: "planned",
    });

    await copiedBlock.populate([
      {
        path: "activityId",
        select: "title description quadrant estimatedDuration completed roleId",
        populate: {
          path: "roleId",
          select: "name color order",
        },
      },
      {
        path: "weeklyPlanId",
        select: "weekStart weekEnd",
      },
    ]);

    copiedBlocks.push(copiedBlock);

    existingTargetBlocks.push({
      _id: copiedBlock._id,
      userId: copiedBlock.userId,
      weeklyPlanId: copiedBlock.weeklyPlanId,
      activityId: copiedBlock.activityId,
      startAt: copiedBlock.startAt,
      endAt: copiedBlock.endAt,
      status: copiedBlock.status,
    } as (typeof existingTargetBlocks)[number]);
  }

  res.status(201).json({
    success: true,
    data: {
      copiedBlocks,
      skippedBlocks,
    },
  });
};

export const getTimeBlocks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const userId = req.userId!;

  const filter: {
    userId: string;
    weeklyPlanId?: string;
  } = {
    userId,
  };

  if (req.query.weeklyPlanId) {
    filter.weeklyPlanId = req.query.weeklyPlanId as string;
  }

  const timeBlocks = await TimeBlock.find(filter)
    .populate({
      path: "activityId",
      select: "title description quadrant estimatedDuration completed roleId",
      populate: {
        path: "roleId",
        select: "name color order",
      },
    })
    .populate({
      path: "weeklyPlanId",
      select: "weekStart weekEnd",
    })
    .sort({ startAt: 1 });

  res.json({
    success: true,
    data: {
      timeBlocks,
    },
  });
};

export const getTimeBlock = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const userId = req.userId!;

  const timeBlock = await TimeBlock.findById(req.params.id)
    .populate({
      path: "activityId",
      select: "title description quadrant estimatedDuration completed roleId",
      populate: {
        path: "roleId",
        select: "name color order",
      },
    })
    .populate({
      path: "weeklyPlanId",
      select: "weekStart weekEnd",
    });

  if (!timeBlock || timeBlock.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Time block not found",
    });
    return;
  }

  res.json({
    success: true,
    data: {
      timeBlock,
    },
  });
};

export const updateTimeBlock = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const userId = req.userId!;

  const { startAt, endAt, status } = req.body;

  const timeBlock = await TimeBlock.findById(req.params.id);

  if (!timeBlock || timeBlock.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Time block not found",
    });
    return;
  }

  const newStartAt =
    startAt !== undefined ? new Date(startAt) : timeBlock.startAt;

  const newEndAt = endAt !== undefined ? new Date(endAt) : timeBlock.endAt;

  if (Number.isNaN(newStartAt.getTime()) || Number.isNaN(newEndAt.getTime())) {
    res.status(400).json({
      success: false,
      message: "Invalid startAt or endAt",
    });
    return;
  }

  if (newEndAt <= newStartAt) {
    res.status(400).json({
      success: false,
      message: "endAt must be after startAt",
    });
    return;
  }

  const weeklyPlan = await WeeklyPlan.findById(timeBlock.weeklyPlanId);

  if (!weeklyPlan || weeklyPlan.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Weekly plan not found",
    });
    return;
  }

  const weekEndBoundary = getWeeklyPlanEndBoundary(weeklyPlan.weekEnd);

  if (newStartAt < weeklyPlan.weekStart || newEndAt > weekEndBoundary) {
    res.status(400).json({
      success: false,
      message: "Time block must be within the weekly plan dates",
    });
    return;
  }

  const existingBlocks = await TimeBlock.find({
    userId,
    status: { $ne: "cancelled" },
  });

  const hasOverlap = existingBlocks.some(
    (block) =>
      block._id.toString() !== timeBlock._id.toString() &&
      block.startAt < newEndAt &&
      block.endAt > newStartAt,
  );

  if (hasOverlap) {
    res.status(409).json({
      success: false,
      message: "Time block overlaps with another scheduled block",
    });
    return;
  }

  timeBlock.startAt = newStartAt;
  timeBlock.endAt = newEndAt;

  if (status !== undefined) {
    timeBlock.status = status;
  }

  await timeBlock.save();

  await timeBlock.populate([
    {
      path: "activityId",
      select: "title description quadrant estimatedDuration completed roleId",
      populate: {
        path: "roleId",
        select: "name color order",
      },
    },
    {
      path: "weeklyPlanId",
      select: "weekStart weekEnd",
    },
  ]);

  res.json({
    success: true,
    data: {
      timeBlock,
    },
  });
};

export const deleteTimeBlock = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const userId = req.userId!;

  const timeBlock = await TimeBlock.findById(req.params.id);

  if (!timeBlock || timeBlock.userId.toString() !== userId) {
    res.status(404).json({
      success: false,
      message: "Time block not found",
    });
    return;
  }

  await timeBlock.deleteOne();

  res.json({
    success: true,
    message: "Time block deleted successfully",
  });
};
