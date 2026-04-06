/**
 * File Controller - Inventory Controller
 * Xử lý request quản lý kho hàng
 */

import { Request, Response } from 'express'
import inventoryService from '../services/inventory.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES } from '../utils/constants'

/**
 * GET /api/inventory
 * Lấy tất cả mục kho (phân trang, lọc theo category)
 */
export const getAllInventory = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const categoryParam = req.query.category as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await inventoryService.getAllInventory(page, limit, categoryParam)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách kho thành công',
    data: result.items,
    meta: result.pagination,
  })
})

/**
 * GET /api/inventory/:id
 * Lấy chi tiết một mục kho
 */
export const getInventoryById = asyncHandler(async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id as string)

  if (isNaN(itemId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const item = await inventoryService.getInventoryById(itemId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin kho thành công',
    data: item,
  })
})

/**
 * POST /api/inventory
 * Tạo mục kho mới
 */
export const createInventory = asyncHandler(async (req: Request, res: Response) => {
  const { name, category, quantity, unit, minStock, supplierId } = req.body

  if (!name || !category || quantity === undefined || !unit || minStock === undefined) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  const item = await inventoryService.createInventory({
    name,
    category,
    quantity,
    unit,
    minStock,
    supplierId,
  })

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: item,
  })
})

/**
 * PUT /api/inventory/:id
 * Cập nhật mục kho
 */
export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id as string)
  const { quantity, minStock, name, unit, supplierId } = req.body

  if (isNaN(itemId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const item = await inventoryService.updateInventory(itemId, {
    quantity,
    minStock,
    name,
    unit,
    supplierId,
  })

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.UPDATED,
    data: item,
  })
})

/**
 * DELETE /api/inventory/:id
 * Xóa mục kho
 */
export const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id as string)

  if (isNaN(itemId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const result = await inventoryService.deleteInventory(itemId)

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.DELETED,
    data: result,
  })
})

/**
 * GET /api/inventory/status/low
 * Lấy mục kho tồn kho thấp
 */
export const getLowStockItems = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await inventoryService.getLowStockItems(page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách kho tồn kho thấp thành công',
    data: result.items,
    meta: result.pagination,
  })
})

/**
 * GET /api/inventory/status/critical
 * Lấy mục kho tồn kho nguy hiểm
 */
export const getCriticalStockItems = asyncHandler(async (req: Request, res: Response) => {
  const items = await inventoryService.getCriticalStockItems()

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách kho tồn kho nguy hiểm thành công',
    data: items,
  })
})

/**
 * GET /api/inventory/category/:category
 * Lấy kho theo danh mục
 */
export const getInventoryByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params as { category: string }
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20

  const result = await inventoryService.getInventoryByCategory(category, page, limit)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách kho theo danh mục thành công',
    data: result.items,
    meta: result.pagination,
  })
})

/**
 * POST /api/inventory/:id/restock
 * Nhập kho (tăng quantity)
 */
export const restockInventory = asyncHandler(async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id as string)
  const { quantity } = req.body

  if (isNaN(itemId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  if (quantity === undefined || typeof quantity !== 'number') {
    throw new ApiError(400, 'INVALID_QUANTITY', 'Số lượng nhập kho không hợp lệ')
  }

  const item = await inventoryService.restockInventory(itemId, quantity)

  res.status(200).json({
    status: 'OK',
    message: 'Nhập kho thành công',
    data: item,
  })
})
