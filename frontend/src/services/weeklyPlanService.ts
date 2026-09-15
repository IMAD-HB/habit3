import api from "../lib/api";
import type {
  CreateWeeklyPlanData,
  UpdateWeeklyPlanData,
  WeeklyPlan,
} from "../types/weeklyPlan";

interface WeeklyPlansResponse {
  success: boolean;
  data: {
    weeklyPlans: WeeklyPlan[];
  };
}

interface WeeklyPlanResponse {
  success: boolean;
  data: {
    weeklyPlan: WeeklyPlan;
  };
}

interface DeleteWeeklyPlanResponse {
  success: boolean;
  message: string;
}

export const getWeeklyPlans = async (): Promise<WeeklyPlansResponse> => {
  const response = await api.get<WeeklyPlansResponse>("/weekly-plans");

  return response.data;
};

export const getWeeklyPlan = async (
  id: string,
): Promise<WeeklyPlanResponse> => {
  const response = await api.get<WeeklyPlanResponse>(`/weekly-plans/${id}`);

  return response.data;
};

export const createWeeklyPlan = async (
  data: CreateWeeklyPlanData,
): Promise<WeeklyPlanResponse> => {
  const response = await api.post<WeeklyPlanResponse>("/weekly-plans", data);

  return response.data;
};

export const updateWeeklyPlan = async (
  id: string,
  data: UpdateWeeklyPlanData,
): Promise<WeeklyPlanResponse> => {
  const response = await api.patch<WeeklyPlanResponse>(
    `/weekly-plans/${id}`,
    data,
  );

  return response.data;
};

export const deleteWeeklyPlan = async (
  id: string,
): Promise<DeleteWeeklyPlanResponse> => {
  const response = await api.delete<DeleteWeeklyPlanResponse>(
    `/weekly-plans/${id}`,
  );

  return response.data;
};
