export type UserRole = 'CUSTOMER' | 'ADMIN' | 'STAFF'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
  password?: string
}
