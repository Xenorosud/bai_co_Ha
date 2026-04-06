/**
 * File Controller - Tables Controller
 * Xử lý các request liên quan đến quản lý bàn
 */

import { Request, Response } from 'express'
import * as tablesService from '../services/tables.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES } from '../utils/constants'

/**
 * GET /api/tables
 * Lấy tất cả bàn (có phân trang)
 * Query params: page, limit, status
 */
export const getAllTables = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const statusParam = req.query.status as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20
  const status = statusParam

  const result = await tablesService.getAllTables(page, limit, status)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách thành công',
    data: result.tables,
    meta: result.pagination,
  })
})

/**
 * GET /api/tables/:id
 * Lấy chi tiết một bàn
 */
export const getTableById = asyncHandler(async (req: Request, res: Response) => {
  const tableId = parseInt(req.params.id as any)

  if (isNaN(tableId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const table = await tablesService.getTableById(tableId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin thành công',
    data: table,
  })
})

/**
 * POST /api/tables
 * Tạo bàn mới (Admin only)
 * Body: { number, capacity }
 */
export const createTable = asyncHandler(async (req: Request, res: Response) => {
  const { number, capacity } = req.body

  // Kiểm tra dữ liệu
  if (!number || !capacity) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  if (typeof number !== 'number' || number <= 0) {
    throw new ApiError(400, 'INVALID_NUMBER', 'Số bàn phải là số dương')
  }

  if (typeof capacity !== 'number' || capacity <= 0) {
    throw new ApiError(400, 'INVALID_CAPACITY', 'Sức chứa phải là số dương')
  }

  const table = await tablesService.createTable({ number, capacity })

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: table,
  })
})

/**
 * PUT /api/tables/:id
 * Cập nhật bàn (Admin/Manager)
 * Body: { status?, capacity? }
 */
export const updateTable = asyncHandler(async (req: Request, res: Response) => {
  const tableId = parseInt(req.params.id as any)

  if (isNaN(tableId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const { status, capacity } = req.body

  // Kiểm tra status nếu có
  if (status && !['EMPTY', 'BEING_USED', 'RESERVED'].includes(status)) {
    throw new ApiError(400, 'INVALID_STATUS', 'Trạng thái không hợp lệ')
  }

  // Kiểm tra capacity nếu có
  if (capacity !== undefined && (typeof capacity !== 'number' || capacity <= 0)) {
    throw new ApiError(400, 'INVALID_CAPACITY', 'Sức chứa phải là số dương')
  }

  const table = await tablesService.updateTable(tableId, {
    ...(status && { status }),
    ...(capacity && { capacity }),
  })

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.UPDATED,
    data: table,
  })
})

/**
 * DELETE /api/tables/:id
 * Xóa bàn (Admin only)
 */
export const deleteTable = asyncHandler(async (req: Request, res: Response) => {
  const tableId = parseInt(req.params.id as any)

  if (isNaN(tableId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const result = await tablesService.deleteTable(tableId)

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.DELETED,
    data: result,
  })
})

/**
 * GET /api/tables/status/:status
 * Lấy bàn theo trạng thái
 * Params: status (EMPTY, BEING_USED, RESERVED)
 */
export const getTablesByStatus = asyncHandler(async (req: Request, res: Response) => {
  const status = req.params.status as 'EMPTY' | 'BEING_USED' | 'RESERVED'

  if (!['EMPTY', 'BEING_USED', 'RESERVED'].includes(status)) {
    throw new ApiError(400, 'INVALID_STATUS', 'Trạng thái không hợp lệ')
  }

  const tables = await tablesService.getTablesByStatus(status)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách thành công',
    data: tables,
  })
})

/**
 * GET /api/tables/available
 * Lấy bàn trống
 */
export const getAvailableTables = asyncHandler(async (req: Request, res: Response) => {
  const tables = await tablesService.getAvailableTables()

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách thành công',
    data: tables,
  })
})

/**
 * POST /api/tables/find-for-guests
 * Tìm bàn phù hợp cho số khách
 * Body: { guestCount }
 */
export const findTableForGuests = asyncHandler(async (req: Request, res: Response) => {
  const { guestCount } = req.body

  if (!guestCount || typeof guestCount !== 'number' || guestCount <= 0) {
    throw new ApiError(400, 'INVALID_GUEST_COUNT', 'Số khách phải là số dương')
  }

  const table = await tablesService.findTableForGuests(guestCount)

  if (!table) {
    return res.status(404).json({
      status: 'ERROR',
      message: 'Không có bàn trống phù hợp cho số khách này',
      code: 'NO_AVAILABLE_TABLE',
    })
  }

  res.status(200).json({
    status: 'OK',
    message: 'Tìm thấy bàn phù hợp',
    data: table,
  })
})
