/**
 * File Controller - Orders Controller
 * Xử lý các request liên quan đến đơn hàng
 */

import { Request, Response } from 'express'
import * as ordersService from '../services/orders.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES } from '../utils/constants'

/**
 * GET /api/orders
 * Lấy tất cả đơn hàng (có phân trang, có thể lọc theo trạng thái)
 * Query params: page, limit, status
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const statusParam = req.query.status as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20
  const status = statusParam

  const result = await ordersService.getAllOrders(page, limit, status)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách đơn hàng thành công',
    data: result.orders,
    meta: result.pagination,
  })
})

/**
 * GET /api/orders/:id
 * Lấy chi tiết một đơn hàng
 */
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as any)

  if (isNaN(orderId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const order = await ordersService.getOrderById(orderId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin đơn hàng thành công',
    data: order,
  })
})

/**
 * POST /api/orders
 * Tạo đơn hàng mới
 * Body: { tableId?, customerId?, employeeId, orderItems, deliveryType, deliveryAddress? }
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { tableId, customerId, employeeId, orderItems, deliveryType, deliveryAddress } = req.body

  // Kiểm tra dữ liệu
  if (!employeeId || !orderItems || !deliveryType) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new ApiError(400, 'INVALID_ORDER_ITEMS', 'Đơn hàng phải có ít nhất một món ăn')
  }

  // Kiểm tra từng order item
  for (const item of orderItems) {
    if (!item.dishId || !item.quantity) {
      throw new ApiError(400, 'INVALID_ORDER_ITEM', 'Mỗi mục phải có dishId và quantity')
    }

    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new ApiError(400, 'INVALID_QUANTITY', 'Số lượng phải là số dương')
    }
  }

  const order = await ordersService.createOrder({
    tableId,
    customerId,
    employeeId,
    orderItems,
    deliveryType,
    deliveryAddress,
  })

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: order,
  })
})

/**
 * PUT /api/orders/:id
 * Cập nhật trạng thái đơn hàng
 * Body: { orderStatus }
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as any)
  const { orderStatus } = req.body

  if (isNaN(orderId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  if (!orderStatus) {
    throw new ApiError(400, 'MISSING_STATUS', 'Trạng thái đơn hàng không được để trống')
  }

  const order = await ordersService.updateOrderStatus(orderId, orderStatus)

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.UPDATED,
    data: order,
  })
})

/**
 * DELETE /api/orders/:id
 * Hủy đơn hàng
 */
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id as any)

  if (isNaN(orderId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const order = await ordersService.cancelOrder(orderId)

  res.status(200).json({
    status: 'OK',
    message: 'Hủy đơn hàng thành công',
    data: order,
  })
})

/**
 * GET /api/orders/status/:status
 * Lấy đơn hàng theo trạng thái
 * Query params: page, limit
 */
export const getOrdersByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params as { status: string }
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await ordersService.getOrdersByStatus(status, page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách đơn hàng theo trạng thái thành công',
    data: result.orders,
    meta: result.pagination,
  })
})

/**
 * GET /api/orders/table/:tableId
 * Lấy đơn hàng của một bàn
 */
export const getOrdersByTable = asyncHandler(async (req: Request, res: Response) => {
  const tableId = parseInt(req.params.tableId as any)

  if (isNaN(tableId)) {
    throw new ApiError(400, 'INVALID_TABLE_ID', 'ID bàn không hợp lệ')
  }

  const orders = await ordersService.getOrdersByTable(tableId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách đơn hàng của bàn thành công',
    data: orders,
  })
})

/**
 * GET /api/orders/customer/:customerId
 * Lấy đơn hàng của khách hàng
 * Query params: page, limit
 */
export const getOrdersByCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params as { customerId: string }
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await ordersService.getOrdersByCustomer(customerId, page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách đơn hàng của khách hàng thành công',
    data: result.orders,
    meta: result.pagination,
  })
})
