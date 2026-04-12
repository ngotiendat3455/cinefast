import type { LoginPayload, RegisterPayload, TokenResponse, UpdateProfilePayload, User } from '../types/auth'
import api from './api'

export const authService = {
  register: async (payload: RegisterPayload): Promise<TokenResponse> => {
    const { data } = await api.post<TokenResponse>('/auth/register', payload)
    return data
  },

  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const { data } = await api.post<TokenResponse>('/auth/login', payload)
    return data
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<User>('/users/me')
    return data
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await api.patch<User>('/users/me', payload)
    return data
  },
}
