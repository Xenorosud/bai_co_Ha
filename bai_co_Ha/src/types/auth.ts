/**
 * Auth Types & Interfaces
 */

export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'SERVER' | 'CUSTOMER'
  status: 'ACTIVE' | 'INACTIVE'
  createdAt?: string
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  // Methods
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>
  logout: () => void
  clearError: () => void
}
