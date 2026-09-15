export interface Role {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  color?: string;
  order?: number;
}
