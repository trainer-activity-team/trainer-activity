import axios from 'axios'

const baseURL = import.meta.env.BACKEND_URL
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register']

let accessTokenGetter: (() => string | null) | null = null
let unauthorizedHandler: (() => void) | null = null

if (!baseURL) {
  throw new Error('Missing BACKEND_URL environment variable.')
}

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function setAccessTokenGetter(getter: (() => string | null) | null) {
  accessTokenGetter = getter
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

apiClient.interceptors.request.use((config) => {
  const token = accessTokenGetter?.()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl: string = error.config?.url ?? ''
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => requestUrl.includes(path))

    if (status === 401 && !isAuthEndpoint) {
      unauthorizedHandler?.()
    }

    return Promise.reject(error)
  },
)
