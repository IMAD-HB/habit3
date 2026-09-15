import mongoose, { Model, Schema } from "mongoose";

export interface IWeeklyPlan {
  userId: mongoose.Types.ObjectId;
  weekStart: Date;
  weekEnd: Date;
  priorities: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const weeklyPlanSchema = new Schema<IWeeklyPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weekStart: {
      type: Date,
      required: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    priorities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
  },
  {
    timestamps: true,
  },
);

weeklyPlanSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

const WeeklyPlan: Model<IWeeklyPlan> = mongoose.model<IWeeklyPlan>(
  "WeeklyPlan",
  weeklyPlanSchema,
);

export default WeeklyPlan;
