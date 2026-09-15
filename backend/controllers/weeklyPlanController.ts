import mongoose from "mongoose";
import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.js";

import Activity from "../models/Activity.js";
import WeeklyPlan from "../models/WeeklyPlan.js";

export const createWeeklyPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { weekStart, weekEnd, priorities = [] } = req.body;

  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const existingPlan = await WeeklyPlan.findOne({
    userId,
    weekStart,
  });

  if (existingPlan) {
    res.status(409).json({
      success: false,
      message: "A weekly plan already exists for this week",
    });
    return;
  }

  if (priorities.length > 0) {
    const validActivities = await Activity.countDocuments({
      _id: { $in: priorities },
      userId,
    });

    if (validActivities !== priorities.length) {
      res.status(400).json({
        success: false,
        message: "One or more activities are invalid",
      });
      return;
    }
  }

  const weeklyPlan = await WeeklyPlan.create({
    userId,
    weekStart,
    weekEnd,
    priorities,
  });

  await weeklyPlan.populate({
    path: "priorities",
    populate: {
      path: "roleId",
      select: "name color order",
    },
  });

  res.status(201).json({
    success: true,
    data: {
      weeklyPlan,
    },
  });
};

export const getWeeklyPlans = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const weeklyPlans = await WeeklyPlan.find({
    userId,
  })
    .populate({
      path: "priorities",
      populate: {
        path: "roleId",
        select: "name color order",
      },
    })
    .sort({ weekStart: -1 });

  res.json({
    success: true,
    data: {
      weeklyPlans,
    },
  });
};

export const getWeeklyPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const weeklyPlan = await WeeklyPlan.findOne({
    _id: req.params.id,
    userId,
  }).populate({
    path: "priorities",
    populate: {
      path: "roleId",
      select: "name color order",
    },
  });

  if (!weeklyPlan) {
    res.status(404).json({
      success: false,
      message: "Weekly plan not found",
    });
    return;
  }

  res.json({
    success: true,
    data: {
      weeklyPlan,
    },
  });
};

export const updateWeeklyPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { weekStart, weekEnd, priorities } = req.body;

  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const weeklyPlan = await WeeklyPlan.findOne({
    _id: req.params.id,
    userId,
  });

  if (!weeklyPlan) {
    res.status(404).json({
      success: false,
      message: "Weekly plan not found",
    });
    return;
  }

  if (priorities !== undefined) {
    const validActivities = await Activity.countDocuments({
      _id: { $in: priorities },
      userId,
    });

    if (validActivities !== priorities.length) {
      res.status(400).json({
        success: false,
        message: "One or more activities are invalid",
      });
      return;
    }

    weeklyPlan.priorities = priorities;
  }

  if (weekStart !== undefined) weeklyPlan.weekStart = weekStart;
  if (weekEnd !== undefined) weeklyPlan.weekEnd = weekEnd;

  await weeklyPlan.save();

  await weeklyPlan.populate({
    path: "priorities",
    populate: {
      path: "roleId",
      select: "name color order",
    },
  });

  res.json({
    success: true,
    data: {
      weeklyPlan,
    },
  });
};

export const deleteWeeklyPlan = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const weeklyPlan = await WeeklyPlan.findOneAndDelete({
    _id: req.params.id,
    userId,
  });

  if (!weeklyPlan) {
    res.status(404).json({
      success: false,
      message: "Weekly plan not found",
    });
    return;
  }

  res.json({
    success: true,
    message: "Weekly plan deleted successfully",
  });
};
