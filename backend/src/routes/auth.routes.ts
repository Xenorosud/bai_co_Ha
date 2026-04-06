/**
 * File Routes - Auth Routes
 * Các endpoint liên quan đến xác thực
 */

import { Router } from 'express'
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

/**
 * POST /api/auth/register - Đăng ký người dùng
 * Body: { email, password, passwordConfirm }
 * Response: { user }
 */
router.post('/register', register)

/**
 * POST /api/auth/login - Đăng nhập
 * Body: { email, password }
 * Response: { accessToken, refreshToken, user }
 */
router.post('/login', login)

/**
 * POST /api/auth/refresh-token - Làm mới token
 * Body: { refreshToken }
 * Response: { accessToken }
 */
router.post('/refresh-token', refresh)

/**
 * POST /api/auth/logout - Đăng xuất
 * Headers: { Authorization: Bearer <token> }
 */
router.post('/logout', authMiddleware, logout)

/**
 * GET /api/auth/me - Lấy thông tin người dùng hiện tại
 * Headers: { Authorization: Bearer <token> }
 * Response: { user }
 */
router.get('/me', authMiddleware, getMe)

export default router
