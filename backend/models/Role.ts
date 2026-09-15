import mongoose, { Model, Schema } from "mongoose";

export interface IRole {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    color: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

roleSchema.index({ userId: 1, order: 1 });

const Role: Model<IRole> = mongoose.model<IRole>("Role", roleSchema);

export default Role;
