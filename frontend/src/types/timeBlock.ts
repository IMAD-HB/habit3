import type { Activity } from "./activity";

export type TimeBlockStatus = "planned" | "completed" | "cancelled";

export interface TimeBlock {
  _id: string;
  userId: string;
  weeklyPlanId:
    | string
    | {
        _id: string;
      };
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

export type CopyWeekSkipReason = "not_current_priority" | "overlap";

export interface CopyWeekData {
  sourceWeeklyPlanId: string;
  targetWeeklyPlanId: string;
}

export interface CopyWeekResponse {
  success: boolean;
  data: {
    copiedBlocks: TimeBlock[];
    skippedBlocks: {
      timeBlockId: string;
      reason: CopyWeekSkipReason;
    }[];
  };
}
