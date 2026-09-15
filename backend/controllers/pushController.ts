import type { Response } from "express";

import mongoose from "mongoose";

import type { AuthRequest } from "../middleware/auth.js";

import PushSubscription from "../models/PushSubscription.js";

export const subscribeToPush = async (
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

  const { endpoint, keys } = req.body;

  if (
    typeof endpoint !== "string" ||
    !endpoint ||
    !keys ||
    typeof keys.p256dh !== "string" ||
    typeof keys.auth !== "string"
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid push subscription",
    });
    return;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);

  await PushSubscription.findOneAndUpdate(
    {
      userId,
      endpoint,
    },
    {
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    },
  );

  res.status(201).json({
    success: true,
    message: "Push subscription saved successfully",
  });
};
