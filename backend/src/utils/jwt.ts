/**
 * File Utilities - JWT Token Management
 * Xử lý tạo, xác minh và làm mới JWT tokens
 */

import jwt from 'jsonwebtoken'
import { JWT_EXPIRY, JWT_REFRESH_EXPIRY } from './constants'

export interface JwtPayload {
  userId: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'SERVER' | 'CUSTOMER'
  iat?: number
  exp?: number
}

/**
 * Tạo JWT Access Token
 * Thời gian sống: 24 giờ
 * @param payload - Dữ liệu cần mã hóa
 * @returns string - Token JWT
 */
export const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: JWT_EXPIRY,
  })
}

/**
 * Tạo JWT Refresh Token
 * Thời gian sống: 7 ngày
 * @param payload - Dữ liệu cần mã hóa
 * @returns string - Refresh Token JWT
 */
export const generateRefreshToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: JWT_REFRESH_EXPIRY,
  })
}

/**
 * Xác minh JWT Token
 * @param token - Token cần xác minh
 * @returns JwtPayload | null - Payload nếu hợp lệ, null nếu không
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload
    return decoded
  } catch (error) {
    console.error('❌ Token verification error:', error)
    return null
  }
}

/**
 * Lấy token từ Authorization header
 * Format: Bearer <token>
 * @param authHeader - Authorization header
 * @returns string | null - Token hoặc null
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

/**
 * Giải mã token mà không kiểm tra chữ ký (để debug)
 * ⚠️ CHỈ SỬ DỤNG CHO DEBUG
 * @param token - Token cần giải mã
 * @returns JwtPayload - Payload
 */
export const decodeTokenWithoutVerify = (token: string): any => {
  try {
    return jwt.decode(token, { complete: true })
  } catch (error) {
    console.error('❌ Error decoding token:', error)
    return null
  }
}
