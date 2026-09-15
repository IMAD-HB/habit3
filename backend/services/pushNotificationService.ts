import mongoose from "mongoose";
import webpush from "web-push";

import PushSubscription from "../models/PushSubscription.js";
import TimeBlock from "../models/TimeBlock.js";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
  throw new Error("VAPID environment variables are not configured.");
}

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

export const sendTimeBlockNotification = async (
  timeBlockId: mongoose.Types.ObjectId,
): Promise<void> => {
  const timeBlock = await TimeBlock.findById(timeBlockId).populate({
    path: "activityId",
    select: "title",
  });

  if (!timeBlock || timeBlock.status !== "planned") {
    return;
  }

  const activity = timeBlock.activityId as unknown as {
    title: string;
  };

  const subscriptions = await PushSubscription.find({
    userId: timeBlock.userId,
  });

  if (subscriptions.length === 0) {
    return;
  }

  const payload = JSON.stringify({
    title: "Habit 3",
    body: `It's time for: ${activity.title}`,
  });

  for (const subscription of subscriptions) {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    try {
      await webpush.sendNotification(pushSubscription, payload);
    } catch (error) {
      if (
        error instanceof webpush.WebPushError &&
        (error.statusCode === 404 || error.statusCode === 410)
      ) {
        await subscription.deleteOne();
      }
    }
  }
};
