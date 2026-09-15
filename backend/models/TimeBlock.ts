import mongoose, { Document, Model, Schema } from "mongoose";

export type TimeBlockStatus = "planned" | "completed" | "cancelled";

export interface ITimeBlock extends Document {
  userId: mongoose.Types.ObjectId;
  weeklyPlanId: mongoose.Types.ObjectId;
  activityId: mongoose.Types.ObjectId;
  startAt: Date;
  endAt: Date;
  status: TimeBlockStatus;
  createdAt: Date;
  updatedAt: Date;
}

const timeBlockSchema = new Schema<ITimeBlock>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weeklyPlanId: {
      type: Schema.Types.ObjectId,
      ref: "WeeklyPlan",
      required: true,
      index: true,
    },
    activityId: {
      type: Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
      index: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "completed", "cancelled"],
      default: "planned",
    },
  },
  { timestamps: true },
);

timeBlockSchema.index({ userId: 1, startAt: 1 });
timeBlockSchema.index({ weeklyPlanId: 1, startAt: 1 });

const TimeBlock: Model<ITimeBlock> = mongoose.model<ITimeBlock>(
  "TimeBlock",
  timeBlockSchema,
);

export default TimeBlock;
