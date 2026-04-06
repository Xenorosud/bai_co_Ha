/**
 * File Middleware - Authentication
 * Xác thực JWT Token cho các request được bảo vệ
 */

import { Request, Response, NextFunction } from 'express'
import { extractTokenFromHeader, verifyToken, JwtPayload } from '../utils/jwt'
import { ERROR_MESSAGES } from '../utils/constants'

/**
 * Mở rộng Express Request để thêm user info
 * Để sử dụng được req.user trong các handler
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

/**
 * Auth Middleware - Xác thực JWT
 * Sử dụng: app.use(authMiddleware) hoặc router.use(authMiddleware)
 *
 * Kiểm tra:
 * 1. Authorization header có tồn tại không
 * 2. Token format có đúng không
 * 3. Token có hợp lệ không
 * 4. Token có hết hạn không
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy token từ Authorization header
    const token = extractTokenFromHeader(req.get('Authorization'))

    if (!token) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Không tìm thấy token xác thực',
        code: 'UNAUTHORIZED',
      })
    }

    // Xác minh token
    const payload = verifyToken(token)

    if (!payload) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Token không hợp lệ hoặc đã hết hạn',
        code: 'INVALID_TOKEN',
      })
    }

    // Gắn user info vào request
    req.user = payload

    next()
  } catch (error) {
    console.error('❌ Auth middleware error:', error)
    return res.status(500).json({
      status: 'ERROR',
      message: ERROR_MESSAGES.SERVER_ERROR,
    })
  }
}

/**
 * Optional Auth Middleware - Xác thực JWT (tùy chọn)
 * Nếu có token hợp lệ, gắn vào req.user
 * Nếu không có token hoặc token không hợp lệ, tiếp tục (req.user = undefined)
 *
 * Sử dụng khi muốn endpoint hoạt động với hoặc không có auth
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.get('Authorization'))

    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        req.user = payload
      }
    }

    next()
  } catch (error) {
    console.error('❌ Optional auth middleware error:', error)
    next()
  }
}
