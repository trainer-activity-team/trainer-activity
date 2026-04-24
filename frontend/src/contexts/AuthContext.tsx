import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuthenticatedUser, LoginResponse } from '../lib/authApi'
import { setAccessTokenGetter, setUnauthorizedHandler } from '../lib/apiClient'

const ACCESS_TOKEN_KEY = 'accessToken'
const CURRENT_USER_KEY = 'currentUser'

type LogoutOptions = {
  redirectTo?: string
}

type AuthContextValue = {
  user: AuthenticatedUser | null
  token: string | null
  login: (payload: LoginResponse) => void
  logout: (options?: LogoutOptions) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredAuth() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  const userJson = localStorage.getItem(CURRENT_USER_KEY)

  if (!token || !userJson) {
    return { token: null, user: null }
  }

  try {
    const user = JSON.parse(userJson) as AuthenticatedUser
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState(() => readStoredAuth())

  const logout = useCallback(
    (options?: LogoutOptions) => {
      setAuthState({ token: null, user: null })
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(CURRENT_USER_KEY)

      const redirectPath = options?.redirectTo ?? '/login'
      navigate(redirectPath, { replace: true })
    },
    [navigate],
  )

  const login = useCallback((payload: LoginResponse) => {
    setAuthState({ token: payload.accessToken, user: payload.user })
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.accessToken)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(payload.user))
  }, [])

  useEffect(() => {
    setAccessTokenGetter(() => authState.token)
  }, [authState.token])

  useEffect(() => {
    setUnauthorizedHandler(() => logout({ redirectTo: '/login' }))
    return () => {
      setUnauthorizedHandler(null)
    }
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: authState.user,
      token: authState.token,
      login,
      logout,
    }),
    [authState.user, authState.token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
