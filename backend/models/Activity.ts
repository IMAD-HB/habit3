import mongoose, { Model, Schema } from "mongoose";

export type Quadrant = "I" | "II" | "III" | "IV";

export interface IActivity {
  userId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  quadrant: Quadrant;
  estimatedDuration?: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    quadrant: {
      type: String,
      enum: ["I", "II", "III", "IV"],
      required: true,
      default: "II",
    },
    estimatedDuration: {
      type: Number,
      min: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({ userId: 1, roleId: 1 });

const Activity: Model<IActivity> = mongoose.model<IActivity>(
  "Activity",
  activitySchema,
);

export default Activity;
