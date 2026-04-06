/**
 * File Routes - Orders Routes
 * Các endpoint liên quan đến quản lý đơn hàng
 */

import { Router } from 'express'
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrdersByStatus,
  getOrdersByTable,
  getOrdersByCustomer,
} from '../controllers/orders.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleCheckMiddleware, permissionCheckMiddleware } from '../middleware/roleCheck.middleware'

const router = Router()

/**
 * POST /api/orders - Tạo đơn hàng mới
 * Body: { tableId?, customerId?, employeeId, orderItems, deliveryType, deliveryAddress? }
 * Yêu cầu: AUTH + ORDER_MANAGEMENT permission (SERVER, MANAGER, ADMIN)
 */
router.post(
  '/',
  authMiddleware,
  permissionCheckMiddleware('orderManagement'),
  createOrder
)

/**
 * GET /api/orders - Lấy tất cả đơn hàng
 * Query: page, limit, status
 * Yêu cầu: AUTH + ORDER_MANAGEMENT permission (SERVER, MANAGER, ADMIN)
 */
router.get(
  '/',
  authMiddleware,
  permissionCheckMiddleware('orderManagement'),
  getAllOrders
)

/**
 * GET /api/orders/status/:status - Lấy đơn hàng theo trạng thái
 * Params: status (PENDING, PROCESSING, COMPLETED, CANCELLED)
 * Query: page, limit
 * Yêu cầu: AUTH + ORDER_MANAGEMENT permission
 */
router.get(
  '/status/:status',
  authMiddleware,
  permissionCheckMiddleware('orderManagement'),
  getOrdersByStatus
)

/**
 * GET /api/orders/table/:tableId - Lấy đơn hàng của một bàn
 * Params: tableId
 * Yêu cầu: AUTH + TABLE_MANAGEMENT permission (SERVER, MANAGER, ADMIN)
 */
router.get(
  '/table/:tableId',
  authMiddleware,
  permissionCheckMiddleware('tableManagement'),
  getOrdersByTable
)

/**
 * GET /api/orders/customer/:customerId - Lấy đơn hàng của khách hàng
 * Params: customerId
 * Query: page, limit
 * Yêu cầu: AUTH (own orders + admin can see all)
 */
router.get(
  '/customer/:customerId',
  authMiddleware,
  getOrdersByCustomer
)

/**
 * GET /api/orders/:id - Lấy chi tiết một đơn hàng
 * Yêu cầu: AUTH + ORDER_MANAGEMENT permission
 */
router.get(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('orderManagement'),
  getOrderById
)

/**
 * PUT /api/orders/:id - Cập nhật trạng thái đơn hàng
 * Body: { orderStatus }
 * Yêu cầu: AUTH + ORDER_MANAGEMENT permission (SERVER, MANAGER, ADMIN)
 */
router.put(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('orderManagement'),
  updateOrderStatus
)

/**
 * DELETE /api/orders/:id - Hủy đơn hàng
 * Yêu cầu: AUTH + ORDER_MANAGEMENT permission (SERVER, MANAGER, ADMIN)
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('orderManagement'),
  cancelOrder
)

export default router
