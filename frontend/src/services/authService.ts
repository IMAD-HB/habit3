import api from "../lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    token: string;
  };
}

interface MeResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

interface UpdateAccountResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await api.get<MeResponse>("/auth/me");

  return response.data;
};

export const updateAccount = async (
  name: string,
  email: string,
): Promise<UpdateAccountResponse> => {
  const response = await api.patch<UpdateAccountResponse>("/auth/me", {
    name,
    email,
  });

  return response.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResponse> => {
  const response = await api.patch<ChangePasswordResponse>("/auth/password", {
    currentPassword,
    newPassword,
  });

  return response.data;
};

export const deleteAccount = async (): Promise<DeleteAccountResponse> => {
  const response = await api.delete<DeleteAccountResponse>("/auth/me");

  return response.data;
};
