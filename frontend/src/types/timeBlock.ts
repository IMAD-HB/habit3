import type { Activity } from "./activity";

export type TimeBlockStatus = "planned" | "completed" | "cancelled";

export interface TimeBlock {
  _id: string;
  userId: string;
  weeklyPlanId: string;
  activityId: Activity | string;
  startAt: string;
  endAt: string;
  status: TimeBlockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeBlockData {
  weeklyPlanId: string;
  activityId: string;
  startAt: string;
  endAt: string;
  status?: TimeBlockStatus;
}

export interface UpdateTimeBlockData {
  startAt?: string;
  endAt?: string;
  status?: TimeBlockStatus;
}
