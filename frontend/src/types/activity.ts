import type { Role } from "./role";

export type Quadrant = "I" | "II" | "III" | "IV";

export interface Activity {
  _id: string;
  roleId: Role | string;
  title: string;
  description?: string;
  quadrant: Quadrant;
  estimatedDuration?: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityData {
  roleId: string;
  title: string;
  description?: string;
  quadrant: Quadrant;
  estimatedDuration?: number;
}

export interface UpdateActivityData {
  roleId?: string;
  title?: string;
  description?: string;
  quadrant?: Quadrant;
  estimatedDuration?: number;
  completed?: boolean;
}
