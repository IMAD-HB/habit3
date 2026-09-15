import mongoose from "mongoose";
import type { Response } from "express";

import Role from "../models/Role.js";
import type { AuthRequest } from "../middleware/auth.js";

export const createRole = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { name, description, color } = req.body;

  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const existingRole = await Role.findOne({
    userId,
    name,
  });

  if (existingRole) {
    res.status(409).json({
      success: false,
      message: "Role already exists",
    });
    return;
  }

  const lastRole = await Role.findOne({ userId })
    .sort({ order: -1 })
    .select("order");

  const order = lastRole ? lastRole.order + 1 : 0;

  const role = await Role.create({
    userId,
    name,
    description,
    color,
    order,
  });

  res.status(201).json({
    success: true,
    data: {
      role,
    },
  });
};

export const getRoles = async (
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

  const roles = await Role.find({
    userId,
  }).sort({ order: 1 });

  res.json({
    success: true,
    data: {
      roles,
    },
  });
};

export const getRole = async (
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

  const role = await Role.findOne({
    _id: req.params.id,
    userId,
  });

  if (!role) {
    res.status(404).json({
      success: false,
      message: "Role not found",
    });
    return;
  }

  res.json({
    success: true,
    data: {
      role,
    },
  });
};

export const updateRole = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { name, description, color, order } = req.body;

  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  const role = await Role.findOne({
    _id: req.params.id,
    userId,
  });

  if (!role) {
    res.status(404).json({
      success: false,
      message: "Role not found",
    });
    return;
  }

  if (name !== undefined && name !== role.name) {
    const existingRole = await Role.findOne({
      _id: { $ne: role._id },
      userId,
      name,
    });

    if (existingRole) {
      res.status(409).json({
        success: false,
        message: "Role already exists",
      });
      return;
    }
  }

  if (name !== undefined) role.name = name;
  if (description !== undefined) role.description = description;
  if (color !== undefined) role.color = color;
  if (order !== undefined) role.order = order;

  await role.save();

  res.json({
    success: true,
    data: {
      role,
    },
  });
};

export const deleteRole = async (
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

  const role = await Role.findOneAndDelete({
    _id: req.params.id,
    userId,
  });

  if (!role) {
    res.status(404).json({
      success: false,
      message: "Role not found",
    });
    return;
  }

  res.json({
    success: true,
    message: "Role deleted successfully",
  });
};
