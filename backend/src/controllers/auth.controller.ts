/**
 * File Controller - Auth Controller
 * Xử lý các request liên quan đến xác thực
 */

import { Request, Response } from 'express'
import { registerUser, loginUser, refreshAccessToken, getUserById } from '../services/auth.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants'

/**
 * POST /api/auth/register
 * Đăng ký người dùng mới
 * Body: { email, password }
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, passwordConfirm } = req.body

  // Kiểm tra dữ liệu
  if (!email || !password || !passwordConfirm) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  if (password !== passwordConfirm) {
    throw new ApiError(400, 'PASSWORD_MISMATCH', 'Mật khẩu không trùng khớp')
  }

  const user = await registerUser(email, password)

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.REGISTERED,
    data: user,
  })
})

/**
 * POST /api/auth/login
 * Đăng nhập người dùng
 * Body: { email, password }
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Kiểm tra dữ liệu
  if (!email || !password) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng nhập email và mật khẩu')
  }

  const result = await loginUser(email, password)

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    data: result,
  })
})

/**
 * POST /api/auth/refresh-token
 * Làm mới access token
 * Body: { refreshToken }
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new ApiError(400, 'MISSING_TOKEN', 'Refresh token là bắt buộc')
  }

  const result = await refreshAccessToken(refreshToken)

  res.status(200).json({
    status: 'OK',
    message: 'Làm mới token thành công',
    data: result,
  })
})

/**
 * POST /api/auth/logout
 * Đăng xuất (phía server không cần làm gì, client delete token)
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
  })
})

/**
 * GET /api/auth/me
 * Lấy thông tin người dùng hiện tại
 * Yêu cầu: Bearer token trong Authorization header
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Yêu cầu xác thực')
  }

  const user = await getUserById(req.user.userId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin thành công',
    data: user,
  })
})
