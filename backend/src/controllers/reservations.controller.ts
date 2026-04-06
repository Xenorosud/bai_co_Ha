/**
 * File Controller - Reservations Controller
 * Xử lý các request liên quan đến đặt bàn
 */

import { Request, Response } from 'express'
import * as reservationsService from '../services/reservations.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES } from '../utils/constants'

/**
 * GET /api/reservations
 * Lấy tất cả đặt bàn (có phân trang, có thể lọc theo trạng thái)
 * Query params: page, limit, status
 */
export const getAllReservations = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const statusParam = req.query.status as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20
  const status = statusParam

  const result = await reservationsService.getAllReservations(page, limit, status)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách đặt bàn thành công',
    data: result.reservations,
    meta: result.pagination,
  })
})

/**
 * GET /api/reservations/:id
 * Lấy chi tiết một đặt bàn
 */
export const getReservationById = asyncHandler(async (req: Request, res: Response) => {
  const reservationId = parseInt(req.params.id as any)

  if (isNaN(reservationId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const reservation = await reservationsService.getReservationById(reservationId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin đặt bàn thành công',
    data: reservation,
  })
})

/**
 * POST /api/reservations
 * Tạo đặt bàn mới
 * Body: { customerName, phone, email, reservationDate, reservationTime, guestCount, specialRequests?, higherTable? }
 */
export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const { customerName, phone, email, reservationDate, reservationTime, guestCount, specialRequests, higherTable } = req.body

  // Kiểm tra dữ liệu
  if (!customerName || !phone || !email || !reservationDate || !reservationTime || !guestCount) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  if (typeof guestCount !== 'number' || guestCount <= 0) {
    throw new ApiError(400, 'INVALID_GUEST_COUNT', 'Số khách phải là số dương')
  }

  const reservation = await reservationsService.createReservation({
    customerName,
    phone,
    email,
    reservationDate: new Date(reservationDate),
    reservationTime: new Date(reservationTime),
    guestCount,
    specialRequests,
    higherTable: higherTable || false,
  })

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: reservation,
  })
})

/**
 * POST /api/reservations/:id/approve
 * Phê duyệt đặt bàn
 * Body: { tableId? }
 */
export const approveReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservationId = parseInt(req.params.id as any)
  const { tableId } = req.body

  if (isNaN(reservationId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const reservation = await reservationsService.approveReservation(reservationId, tableId)

  res.status(200).json({
    status: 'OK',
    message: 'Phê duyệt đặt bàn thành công',
    data: reservation,
  })
})

/**
 * POST /api/reservations/:id/deny
 * Từ chối đặt bàn
 */
export const denyReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservationId = parseInt(req.params.id as any)

  if (isNaN(reservationId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const reservation = await reservationsService.denyReservation(reservationId)

  res.status(200).json({
    status: 'OK',
    message: 'Từ chối đặt bàn thành công',
    data: reservation,
  })
})

/**
 * POST /api/reservations/:id/complete
 * Hoàn thành đặt bàn
 */
export const completeReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservationId = parseInt(req.params.id as any)

  if (isNaN(reservationId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const reservation = await reservationsService.completeReservation(reservationId)

  res.status(200).json({
    status: 'OK',
    message: 'Hoàn thành đặt bàn thành công',
    data: reservation,
  })
})

/**
 * DELETE /api/reservations/:id
 * Hủy đặt bàn
 */
export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservationId = parseInt(req.params.id as any)

  if (isNaN(reservationId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const reservation = await reservationsService.cancelReservation(reservationId)

  res.status(200).json({
    status: 'OK',
    message: 'Hủy đặt bàn thành công',
    data: reservation,
  })
})

/**
 * GET /api/reservations/date/:date
 * Lấy đặt bàn theo ngày
 * Params: date (YYYY-MM-DD)
 * Query params: page, limit
 */
export const getReservationsByDate = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.params as { date: string }
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, 'INVALID_DATE_FORMAT', 'Định dạng ngày không hợp lệ (phải là YYYY-MM-DD)')
    }

    const result = await reservationsService.getReservationsByDate(parsedDate, page, limit)

    res.status(200).json({
      status: 'OK',
      message: 'Lấy danh sách đặt bàn theo ngày thành công',
      data: result.reservations,
      meta: result.pagination,
    })
  } catch (error) {
    throw error
  }
})

/**
 * GET /api/reservations/status/:status
 * Lấy đặt bàn theo trạng thái
 * Params: status (PENDING, APPROVED, DENIED, COMPLETED, CANCELLED)
 * Query params: page, limit
 */
export const getReservationsByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params as { status: string }
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await reservationsService.getReservationsByStatus(status, page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách đặt bàn theo trạng thái thành công',
    data: result.reservations,
    meta: result.pagination,
  })
})
