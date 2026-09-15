import api from "../lib/api";
import type {
  Activity,
  CreateActivityData,
  UpdateActivityData,
} from "../types/activity";

interface ActivitiesResponse {
  success: boolean;
  data: {
    activities: Activity[];
  };
}

interface ActivityResponse {
  success: boolean;
  data: {
    activity: Activity;
  };
}

interface DeleteActivityResponse {
  success: boolean;
  message: string;
}

export const getActivities = async (
  roleId?: string,
): Promise<ActivitiesResponse> => {
  const response = await api.get<ActivitiesResponse>("/activities", {
    params: roleId ? { roleId } : undefined,
  });

  return response.data;
};

export const getActivity = async (id: string): Promise<ActivityResponse> => {
  const response = await api.get<ActivityResponse>(`/activities/${id}`);

  return response.data;
};

export const createActivity = async (
  data: CreateActivityData,
): Promise<ActivityResponse> => {
  const response = await api.post<ActivityResponse>("/activities", data);

  return response.data;
};

export const updateActivity = async (
  id: string,
  data: UpdateActivityData,
): Promise<ActivityResponse> => {
  const response = await api.patch<ActivityResponse>(`/activities/${id}`, data);

  return response.data;
};

export const deleteActivity = async (
  id: string,
): Promise<DeleteActivityResponse> => {
  const response = await api.delete<DeleteActivityResponse>(
    `/activities/${id}`,
  );

  return response.data;
};
