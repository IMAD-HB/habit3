import type { Activity } from "./activity";

export interface WeeklyPlan {
  _id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  priorities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWeeklyPlanData {
  weekStart: string;
  weekEnd: string;
  priorities: string[];
}

export interface UpdateWeeklyPlanData {
  weekStart?: string;
  weekEnd?: string;
  priorities?: string[];
}
