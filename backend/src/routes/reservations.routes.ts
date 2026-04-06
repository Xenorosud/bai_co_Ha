/**
 * File Routes - Reservations Routes
 * Các endpoint liên quan đến quản lý đặt bàn
 */

import { Router } from 'express'
import {
  getAllReservations,
  getReservationById,
  createReservation,
  approveReservation,
  denyReservation,
  completeReservation,
  cancelReservation,
  getReservationsByDate,
  getReservationsByStatus,
} from '../controllers/reservations.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { permissionCheckMiddleware } from '../middleware/roleCheck.middleware'

const router = Router()

/**
 * POST /api/reservations - Tạo đặt bàn mới
 * Body: { customerName, phone, email, reservationDate, reservationTime, guestCount, specialRequests?, higherTable? }
 * Công khai (không cần auth)
 */
router.post('/', createReservation)

/**
 * GET /api/reservations - Lấy tất cả đặt bàn
 * Query: page, limit, status
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission (SERVER, MANAGER, ADMIN)
 */
router.get(
  '/',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  getAllReservations
)

/**
 * GET /api/reservations/date/:date - Lấy đặt bàn theo ngày
 * Params: date (YYYY-MM-DD)
 * Query: page, limit
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission
 */
router.get(
  '/date/:date',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  getReservationsByDate
)

/**
 * GET /api/reservations/status/:status - Lấy đặt bàn theo trạng thái
 * Params: status (PENDING, APPROVED, DENIED, COMPLETED, CANCELLED)
 * Query: page, limit
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission
 */
router.get(
  '/status/:status',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  getReservationsByStatus
)

/**
 * GET /api/reservations/:id - Lấy chi tiết một đặt bàn
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission
 */
router.get(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  getReservationById
)

/**
 * POST /api/reservations/:id/approve - Phê duyệt đặt bàn
 * Body: { tableId? }
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission (MANAGER, ADMIN)
 */
router.post(
  '/:id/approve',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  approveReservation
)

/**
 * POST /api/reservations/:id/deny - Từ chối đặt bàn
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission (MANAGER, ADMIN)
 */
router.post(
  '/:id/deny',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  denyReservation
)

/**
 * POST /api/reservations/:id/complete - Hoàn thành đặt bàn
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission (SERVER, MANAGER, ADMIN)
 */
router.post(
  '/:id/complete',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  completeReservation
)

/**
 * DELETE /api/reservations/:id - Hủy đặt bàn
 * Yêu cầu: AUTH + RESERVATION_MANAGEMENT permission
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('reservationManagement'),
  cancelReservation
)

export default router
