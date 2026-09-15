import api from "../lib/api";
import type { CreateRoleData, Role, UpdateRoleData } from "../types/role";

interface RolesResponse {
  success: boolean;
  data: {
    roles: Role[];
  };
}

interface RoleResponse {
  success: boolean;
  data: {
    role: Role;
  };
}

interface DeleteRoleResponse {
  success: boolean;
  message: string;
}

export const getRoles = async (): Promise<RolesResponse> => {
  const response = await api.get<RolesResponse>("/roles");

  return response.data;
};

export const getRole = async (id: string): Promise<RoleResponse> => {
  const response = await api.get<RoleResponse>(`/roles/${id}`);

  return response.data;
};

export const createRole = async (
  data: CreateRoleData,
): Promise<RoleResponse> => {
  const response = await api.post<RoleResponse>("/roles", data);

  return response.data;
};

export const updateRole = async (
  id: string,
  data: UpdateRoleData,
): Promise<RoleResponse> => {
  const response = await api.patch<RoleResponse>(`/roles/${id}`, data);

  return response.data;
};

export const deleteRole = async (id: string): Promise<DeleteRoleResponse> => {
  const response = await api.delete<DeleteRoleResponse>(`/roles/${id}`);

  return response.data;
};
