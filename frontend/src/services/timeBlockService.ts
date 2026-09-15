import api from "../lib/api";
import type {
  CreateTimeBlockData,
  TimeBlock,
  UpdateTimeBlockData,
} from "../types/timeBlock";

interface TimeBlocksResponse {
  success: boolean;
  data: {
    timeBlocks: TimeBlock[];
  };
}

interface TimeBlockResponse {
  success: boolean;
  data: {
    timeBlock: TimeBlock;
  };
}

interface DeleteTimeBlockResponse {
  success: boolean;
  message: string;
}

export const getTimeBlocks = async (
  weeklyPlanId?: string,
): Promise<TimeBlocksResponse> => {
  const response = await api.get<TimeBlocksResponse>("/time-blocks", {
    params: weeklyPlanId ? { weeklyPlanId } : undefined,
  });

  return response.data;
};

export const getTimeBlock = async (id: string): Promise<TimeBlockResponse> => {
  const response = await api.get<TimeBlockResponse>(`/time-blocks/${id}`);

  return response.data;
};

export const createTimeBlock = async (
  data: CreateTimeBlockData,
): Promise<TimeBlockResponse> => {
  const response = await api.post<TimeBlockResponse>("/time-blocks", data);

  return response.data;
};

export const updateTimeBlock = async (
  id: string,
  data: UpdateTimeBlockData,
): Promise<TimeBlockResponse> => {
  const response = await api.patch<TimeBlockResponse>(
    `/time-blocks/${id}`,
    data,
  );

  return response.data;
};

export const deleteTimeBlock = async (
  id: string,
): Promise<DeleteTimeBlockResponse> => {
  const response = await api.delete<DeleteTimeBlockResponse>(
    `/time-blocks/${id}`,
  );

  return response.data;
};
