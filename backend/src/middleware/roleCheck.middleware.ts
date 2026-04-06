/**
 * File Middleware - Role & Permission Checking
 * Kiểm tra vai trò và quyền người dùng
 */

import { Request, Response, NextFunction } from 'express'
import { ERROR_MESSAGES } from '../utils/constants'

/**
 * Kiểu Roles - Danh sách vai trò được phép
 */
export type AllowedRoles = 'ADMIN' | 'MANAGER' | 'SERVER' | 'CUSTOMER'

/**
 * Role Check Middleware - Kiểm tra vai trò người dùng
 * @param allowedRoles - Danh sách vai trò được phép truy cập
 * @returns Middleware function
 *
 * Ví dụ:
 * - router.delete('/users/:id', roleCheckMiddleware('ADMIN'), deleteUser)
 * - router.post('/orders', roleCheckMiddleware(['ADMIN', 'MANAGER', 'SERVER']), createOrder)
 */
export const roleCheckMiddleware = (allowedRoles: AllowedRoles | AllowedRoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Kiểm tra user có được xác thực không
    if (!req.user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Yêu cầu xác thực',
        code: 'UNAUTHORIZED',
      })
    }

    // Chuyển allowedRoles thành mảng nếu cần
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    // Kiểm tra user role có trong danh sách cho phép không
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'ERROR',
        message: ERROR_MESSAGES.FORBIDDEN,
        code: 'FORBIDDEN',
        requiredRoles: roles,
        userRole: req.user.role,
      })
    }

    next()
  }
}

/**
 * Permission Check Middleware - Kiểm tra quyền người dùng
 * Đọc permissions từ database dựa vào employee record
 *
 * Ví dụ:
 * - router.put('/dishes/:id', permissionCheckMiddleware('foodManagement'), updateDish)
 * - router.get('/reports', permissionCheckMiddleware('dashboard'), getReports)
 */
export const permissionCheckMiddleware = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Kiểm tra user được xác thực
      if (!req.user) {
        return res.status(401).json({
          status: 'ERROR',
          message: 'Yêu cầu xác thực',
          code: 'UNAUTHORIZED',
        })
      }

      // Admin luôn có tất cả quyền
      if (req.user.role === 'ADMIN') {
        return next()
      }

      // Lấy thông tin employee từ database
      // (Sẽ implement sau khi tạo employee service)
      // Tạm thời, chúng tôi sẽ lưu permissions trong token hoặc trả về lỗi

      return res.status(403).json({
        status: 'ERROR',
        message: 'Bạn không có quyền truy cập tính năng này',
        code: 'FORBIDDEN',
        requiredPermission: requiredPermission,
      })
    } catch (error) {
      console.error('❌ Permission check error:', error)
      return res.status(500).json({
        status: 'ERROR',
        message: ERROR_MESSAGES.SERVER_ERROR,
      })
    }
  }
}

/**
 * Owner Check Middleware - Kiểm tra người dùng có phải chủ sở hữu không
 * @param resourceOwnerId - ID của chủ sở hữu tài nguyên
 */
export const ownerCheckMiddleware = (resourceOwnerId: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Yêu cầu xác thực',
        code: 'UNAUTHORIZED',
      })
    }

    // Admin có thể truy cập mọi tài nguyên
    if (req.user.role === 'ADMIN') {
      return next()
    }

    // Kiểm tra user ID có trùng khớp không
    if (req.user.userId !== resourceOwnerId) {
      return res.status(403).json({
        status: 'ERROR',
        message: 'Bạn không có quyền truy cập tài nguyên này',
        code: 'FORBIDDEN',
      })
    }

    next()
  }
}
