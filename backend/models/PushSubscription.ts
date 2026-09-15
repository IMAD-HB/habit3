import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPushSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: Date;
  updatedAt: Date;
}

const pushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

pushSubscriptionSchema.index({ userId: 1, endpoint: 1 }, { unique: true });

const PushSubscription: Model<IPushSubscription> =
  mongoose.model<IPushSubscription>("PushSubscription", pushSubscriptionSchema);

export default PushSubscription;
