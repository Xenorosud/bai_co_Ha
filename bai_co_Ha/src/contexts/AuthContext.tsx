/**
 * Auth Context - Global authentication state
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { AuthContextType, AuthResponse, User } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Auth Provider Component
// ============================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // Load user from localStorage on mount
  // ============================================

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("restora_user");
        const storedToken = localStorage.getItem("restora_access_token");

        if (storedUser && storedToken) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        }
      } catch (err) {
        console.error("Failed to load auth state:", err);
        localStorage.removeItem("restora_user");
        localStorage.removeItem("restora_access_token");
        localStorage.removeItem("restora_refresh_token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ============================================
  // Login
  // ============================================

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);
      const { accessToken, refreshToken, user: userData } = response.data.data;

      // Store tokens with correct keys
      localStorage.setItem("restora_access_token", accessToken);
      localStorage.setItem("restora_refresh_token", refreshToken);
      localStorage.setItem("restora_user", JSON.stringify(userData));

      setUser(userData);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Register
  // ============================================

  const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(email, password, passwordConfirm);
      const { accessToken, refreshToken, user: userData } = response.data.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // Logout
  // ============================================

  const logout = (): void => {
    localStorage.removeItem("restora_access_token");
    localStorage.removeItem("restora_refresh_token");
    localStorage.removeItem("restora_user");
    setUser(null);
    setError(null);
  };

  // ============================================
  // Clear error
  // ============================================

  const clearError = (): void => {
    setError(null);
  };

  // ============================================
  // Context value
  // ============================================

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// useAuth Hook
// ============================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
