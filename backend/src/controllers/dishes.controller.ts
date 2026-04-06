/**
 * File Controller - Dishes Controller
 * Xử lý các request liên quan đến thực phẩm
 */

import { Request, Response } from 'express'
import * as dishesService from '../services/dishes.service'
import { asyncHandler, ApiError } from '../middleware/errorHandler'
import { SUCCESS_MESSAGES } from '../utils/constants'

/**
 * GET /api/dishes
 * Lấy tất cả món ăn (có phân trang)
 * Query params: page, limit, search
 */
export const getAllDishes = asyncHandler(async (req: Request, res: Response) => {
  const pageParam = req.query.page as string | undefined
  const limitParam = req.query.limit as string | undefined
  const searchParam = req.query.search as string | undefined

  const page = parseInt(pageParam || '1') || 1
  const limit = parseInt(limitParam || '20') || 20
  const search = searchParam

  let result

  if (search) {
    const dishes = await dishesService.searchDishes(search)
    result = {
      dishes,
      pagination: {
        page: 1,
        limit: dishes.length,
        total: dishes.length,
        totalPages: 1,
        hasMore: false,
      },
    }
  } else {
    result = await dishesService.getAllDishes(page, limit)
  }

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách thành công',
    data: result.dishes,
    meta: result.pagination,
  })
})

/**
 * GET /api/dishes/:id
 * Lấy chi tiết một món ăn
 */
export const getDishById = asyncHandler(async (req: Request, res: Response) => {
  const dishId = parseInt(req.params.id as any)

  if (isNaN(dishId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const dish = await dishesService.getDishById(dishId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy thông tin thành công',
    data: dish,
  })
})

/**
 * POST /api/dishes
 * Tạo món ăn mới (Admin only)
 * Body: { name, description, price, image, typeId }
 */
export const createDish = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, image, typeId } = req.body

  // Kiểm tra dữ liệu
  if (!name || !description || !price || !image || !typeId) {
    throw new ApiError(400, 'MISSING_FIELDS', 'Vui lòng điền đầy đủ thông tin')
  }

  if (typeof price !== 'number' || price <= 0) {
    throw new ApiError(400, 'INVALID_PRICE', 'Giá phải là số dương')
  }

  const dish = await dishesService.createDish({
    name,
    description,
    price,
    image,
    typeId,
  })

  res.status(201).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.CREATED,
    data: dish,
  })
})

/**
 * PUT /api/dishes/:id
 * Cập nhật món ăn (Admin only)
 * Body: { name?, description?, price?, image?, typeId?, availability? }
 */
export const updateDish = asyncHandler(async (req: Request, res: Response) => {
  const dishId = parseInt(req.params.id as any)

  if (isNaN(dishId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const { name, description, price, image, typeId, availability } = req.body

  // Kiểm tra giá
  if (price !== undefined && (typeof price !== 'number' || price <= 0)) {
    throw new ApiError(400, 'INVALID_PRICE', 'Giá phải là số dương')
  }

  const dish = await dishesService.updateDish(dishId, {
    ...(name && { name }),
    ...(description && { description }),
    ...(price && { price }),
    ...(image && { image }),
    ...(typeId && { typeId }),
    ...(availability !== undefined && { availability }),
  })

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.UPDATED,
    data: dish,
  })
})

/**
 * DELETE /api/dishes/:id
 * Xóa món ăn (Admin only)
 */
export const deleteDish = asyncHandler(async (req: Request, res: Response) => {
  const dishId = parseInt(req.params.id as any)

  if (isNaN(dishId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID không hợp lệ')
  }

  const result = await dishesService.deleteDish(dishId)

  res.status(200).json({
    status: 'OK',
    message: SUCCESS_MESSAGES.DELETED,
    data: result,
  })
})

/**
 * GET /api/dishes/type/:typeId
 * Lấy món ăn theo loại
 */
export const getDishesByType = asyncHandler(async (req: Request, res: Response) => {
  const typeId = parseInt(req.params.typeId as string)

  if (isNaN(typeId)) {
    throw new ApiError(400, 'INVALID_ID', 'ID loại không hợp lệ')
  }

  const dishes = await dishesService.getDishesByType(typeId)

  res.status(200).json({
    status: 'OK',
    message: 'Lấy danh sách thành công',
    data: dishes,
  })
})
