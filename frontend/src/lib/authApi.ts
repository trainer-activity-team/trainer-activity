import { apiClient } from './apiClient'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type AuthenticatedUser = {
  id: number
  email: string
  firstName: string
  lastName: string
  roleId: number
}

export type LoginResponse = {
  accessToken: string
  user: AuthenticatedUser
}

export type RegisterResponse = {
  message: string
  user: AuthenticatedUser
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload)
  return response.data
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<RegisterResponse>('/auth/register', payload)
  return response.data
}
