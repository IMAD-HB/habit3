import mongoose from "mongoose";
import type { Response } from "express";

import type { AuthRequest } from "../middleware/auth.js";

import Activity from "../models/Activity.js";
import Role from "../models/Role.js";

export const createActivity = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { roleId, title, description, quadrant, estimatedDuration } = req.body;

  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const role = await Role.findOne({
    _id: roleId,
    userId,
  });

  if (!role) {
    res.status(404).json({
      success: false,
      message: "Role not found",
    });
    return;
  }

  const activity = await Activity.create({
    userId,
    roleId: role._id,
    title,
    description,
    quadrant,
    estimatedDuration,
  });

  res.status(201).json({
    success: true,
    data: {
      activity,
    },
  });
};

export const getActivities = async (
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

  const filter: {
    userId: mongoose.Types.ObjectId;
    roleId?: mongoose.Types.ObjectId;
  } = {
    userId,
  };

  if (typeof req.query.roleId === "string") {
    filter.roleId = new mongoose.Types.ObjectId(req.query.roleId);
  }

  const activities = await Activity.find(filter)
    .populate("roleId", "name color order")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      activities,
    },
  });
};

export const getActivity = async (
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

  const activity = await Activity.findOne({
    _id: req.params.id,
    userId,
  }).populate("roleId", "name color order");

  if (!activity) {
    res.status(404).json({
      success: false,
      message: "Activity not found",
    });
    return;
  }

  res.json({
    success: true,
    data: {
      activity,
    },
  });
};

export const updateActivity = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { roleId, title, description, quadrant, estimatedDuration, completed } =
    req.body;

  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const activity = await Activity.findOne({
    _id: req.params.id,
    userId,
  });

  if (!activity) {
    res.status(404).json({
      success: false,
      message: "Activity not found",
    });
    return;
  }

  if (roleId !== undefined) {
    const role = await Role.findOne({
      _id: roleId,
      userId,
    });

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    activity.roleId = role._id;
  }

  if (title !== undefined) activity.title = title;
  if (description !== undefined) activity.description = description;
  if (quadrant !== undefined) activity.quadrant = quadrant;

  if (estimatedDuration !== undefined) {
    activity.estimatedDuration = estimatedDuration;
  }

  if (completed !== undefined) {
    activity.completed = completed;
  }

  await activity.save();
  await activity.populate("roleId", "name color order");

  res.json({
    success: true,
    data: {
      activity,
    },
  });
};

export const deleteActivity = async (
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

  const activity = await Activity.findOneAndDelete({
    _id: req.params.id,
    userId,
  });

  if (!activity) {
    res.status(404).json({
      success: false,
      message: "Activity not found",
    });
    return;
  }

  res.json({
    success: true,
    message: "Activity deleted successfully",
  });
};
