import api from './api';
import { ApiResponse } from '../types/api';
import { AuthResponseData, LoginRequest, MeResponseData, RegisterRequest } from '../types/auth';

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return res.data.data!;
  },

  async login(data: LoginRequest): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return res.data.data!;
  },

  async getMe(): Promise<MeResponseData> {
    const res = await api.get<ApiResponse<MeResponseData>>('/auth/me');
    return res.data.data!;
  },
};