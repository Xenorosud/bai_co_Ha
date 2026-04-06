/**
 * File Routes - Employees Routes
 * Các endpoint quản lý nhân viên
 */

import { Router } from 'express'
import {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  updatePermissions,
  getEmployeesByStatus,
  getEmployeesByRole,
  toggleEmployeeStatus,
} from '../controllers/employees.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { permissionCheckMiddleware } from '../middleware/roleCheck.middleware'

const router = Router()

/**
 * GET /api/employees - Lấy tất cả nhân viên
 * Query: page, limit, status
 * Yêu cầu: AUTH + workersManagement permission (ADMIN, MANAGER)
 */
router.get(
  '/',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  getAllEmployees
)

/**
 * GET /api/employees/status/:status - Lấy nhân viên theo trạng thái
 * Query: page, limit
 * Yêu cầu: AUTH + workersManagement permission
 */
router.get(
  '/status/:status',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  getEmployeesByStatus
)

/**
 * GET /api/employees/role/:role - Lấy nhân viên theo vai trò
 * Query: page, limit
 * Yêu cầu: AUTH + workersManagement permission
 */
router.get(
  '/role/:role',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  getEmployeesByRole
)

/**
 * POST /api/employees - Tạo nhân viên mới
 * Body: { userId, name, phone, hireDate }
 * Yêu cầu: AUTH + workersManagement permission (ADMIN only)
 */
router.post(
  '/',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  createEmployee
)

/**
 * GET /api/employees/:id - Lấy chi tiết nhân viên
 * Yêu cầu: AUTH + workersManagement permission
 */
router.get(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  getEmployeeById
)

/**
 * PUT /api/employees/:id - Cập nhật thông tin nhân viên
 * Body: { name?, phone?, status? }
 * Yêu cầu: AUTH + workersManagement permission
 */
router.put(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  updateEmployee
)

/**
 * PUT /api/employees/:id/permissions - Cập nhật quyền nhân viên
 * Body: { permissions: Record<string, boolean> }
 * Yêu cầu: AUTH + workersManagement permission (ADMIN only)
 */
router.put(
  '/:id/permissions',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  updatePermissions
)

/**
 * PATCH /api/employees/:id/toggle-status - Kích hoạt/Vô hiệu hóa nhân viên
 * Yêu cầu: AUTH + workersManagement permission
 */
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  toggleEmployeeStatus
)

/**
 * DELETE /api/employees/:id - Xóa nhân viên
 * Yêu cầu: AUTH + workersManagement permission (ADMIN only)
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('workersManagement'),
  deleteEmployee
)

export default router
