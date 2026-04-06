/**
 * File Routes - Dishes Routes
 * Các endpoint liên quan đến quản lý thực phẩm
 */

import { Router } from 'express'
import {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  getDishesByType,
} from '../controllers/dishes.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleCheckMiddleware } from '../middleware/roleCheck.middleware'

const router = Router()

/**
 * GET /api/dishes - Lấy tất cả món ăn
 * Query: page, limit, search
 * Công khai (không cần auth)
 */
router.get('/', getAllDishes)

/**
 * GET /api/dishes/:id - Lấy chi tiết món ăn
 * Công khai
 */
router.get('/:id', getDishById)

/**
 * GET /api/dishes/type/:typeId - Lấy món ăn theo loại
 * Công khai
 */
router.get('/type/:typeId', getDishesByType)

/**
 * POST /api/dishes - Tạo món ăn mới
 * Body: { name, description, price, image, typeId }
 * Yêu cầu: Admin only
 */
router.post(
  '/',
  authMiddleware,
  roleCheckMiddleware('ADMIN'),
  createDish
)

/**
 * PUT /api/dishes/:id - Cập nhật món ăn
 * Body: { name?, description?, price?, image?, typeId?, availability? }
 * Yêu cầu: Admin only
 */
router.put(
  '/:id',
  authMiddleware,
  roleCheckMiddleware('ADMIN'),
  updateDish
)

/**
 * DELETE /api/dishes/:id - Xóa món ăn
 * Yêu cầu: Admin only
 */
router.delete(
  '/:id',
  authMiddleware,
  roleCheckMiddleware('ADMIN'),
  deleteDish
)

export default router
