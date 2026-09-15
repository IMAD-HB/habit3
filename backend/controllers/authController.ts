import type { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { AuthRequest } from "../middleware/auth.js";

import User from "../models/User.js";
import Role from "../models/Role.js";
import Activity from "../models/Activity.js";
import WeeklyPlan from "../models/WeeklyPlan.js";
import TimeBlock from "../models/TimeBlock.js";

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.userId).select("-password");

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409).json({
      success: false,
      message: "Email is already registered",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const token = generateToken(user._id.toString());

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
};

export const updateAccount = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { name, email } = req.body;

  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
      return;
    }

    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
    return;
  }

  if (currentPassword === newPassword) {
    res.status(400).json({
      success: false,
      message: "New password must be different from the current password",
    });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 12);

  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
};

export const deleteAccount = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  await TimeBlock.deleteMany({ userId: user._id });
  await WeeklyPlan.deleteMany({ userId: user._id });
  await Activity.deleteMany({ userId: user._id });
  await Role.deleteMany({ userId: user._id });
  await User.findByIdAndDelete(user._id);

  res.json({
    success: true,
    message: "Account deleted successfully",
  });
};
