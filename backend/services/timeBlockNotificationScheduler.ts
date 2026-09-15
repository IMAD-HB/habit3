import TimeBlock from "../models/TimeBlock.js";
import { sendTimeBlockNotification } from "./pushNotificationService.js";

let isRunning = false;

export const processDueTimeBlockNotifications = async (): Promise<void> => {
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    const now = new Date();

    const dueTimeBlocks = await TimeBlock.find({
      status: "planned",
      startAt: { $lte: now },
      notificationSentAt: { $exists: false },
    }).select("_id");

    for (const timeBlock of dueTimeBlocks) {
      const claimedTimeBlock = await TimeBlock.findOneAndUpdate(
        {
          _id: timeBlock._id,
          status: "planned",
          notificationSentAt: { $exists: false },
        },
        {
          $set: {
            notificationSentAt: new Date(),
          },
        },
        {
          returnDocument: "after",
        },
      );

      if (!claimedTimeBlock) {
        continue;
      }

      try {
        await sendTimeBlockNotification(claimedTimeBlock._id);
      } catch (error) {
        await TimeBlock.updateOne(
          {
            _id: claimedTimeBlock._id,
            notificationSentAt: { $exists: true },
          },
          {
            $unset: {
              notificationSentAt: "",
            },
          },
        );

        console.error(
          `Failed to send notification for time block ${claimedTimeBlock._id}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error("Failed to process time block notifications:", error);
  } finally {
    isRunning = false;
  }
};

export const startTimeBlockNotificationScheduler = (): void => {
  void processDueTimeBlockNotifications();

  setInterval(() => {
    void processDueTimeBlockNotifications();
  }, 60_000);
};
