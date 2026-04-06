/**
 * File Routes - Tables Routes
 * Các endpoint liên quan đến quản lý bàn
 */

import { Router } from 'express'
import {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  getTablesByStatus,
  getAvailableTables,
  findTableForGuests,
} from '../controllers/tables.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleCheckMiddleware } from '../middleware/roleCheck.middleware'

const router = Router()

/**
 * GET /api/tables - Lấy tất cả bàn
 * Query: page, limit, status
 * Công khai
 */
router.get('/', getAllTables)

/**
 * GET /api/tables/available - Lấy bàn trống
 * Công khai
 */
router.get('/available', getAvailableTables)

/**
 * GET /api/tables/status/:status - Lấy bàn theo trạng thái
 * Công khai
 */
router.get('/status/:status', getTablesByStatus)

/**
 * GET /api/tables/:id - Lấy chi tiết bàn
 * Công khai
 */
router.get('/:id', getTableById)

/**
 * POST /api/tables - Tạo bàn mới
 * Body: { number, capacity }
 * Yêu cầu: Admin only
 */
router.post(
  '/',
  authMiddleware,
  roleCheckMiddleware('ADMIN'),
  createTable
)

/**
 * POST /api/tables/find-for-guests - Tìm bàn cho khách
 * Body: { guestCount }
 * Công khai hoặc staff
 */
router.post(
  '/find-for-guests',
  findTableForGuests
)

/**
 * PUT /api/tables/:id - Cập nhật bàn
 * Body: { status?, capacity? }
 * Yêu cầu: Admin/Manager
 */
router.put(
  '/:id',
  authMiddleware,
  roleCheckMiddleware(['ADMIN', 'MANAGER']),
  updateTable
)

/**
 * DELETE /api/tables/:id - Xóa bàn
 * Yêu cầu: Admin only
 */
router.delete(
  '/:id',
  authMiddleware,
  roleCheckMiddleware('ADMIN'),
  deleteTable
)

export default router
