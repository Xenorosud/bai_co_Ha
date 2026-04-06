/**
 * File Routes - Inventory Routes
 * Các endpoint quản lý kho hàng
 */

import { Router } from 'express'
import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getLowStockItems,
  getCriticalStockItems,
  getInventoryByCategory,
  restockInventory,
} from '../controllers/inventory.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { permissionCheckMiddleware } from '../middleware/roleCheck.middleware'

const router = Router()

/**
 * GET /api/inventory - Lấy tất cả kho (công khai)
 */
router.get('/', getAllInventory)

/**
 * GET /api/inventory/status/critical - Lấy kho tồn kho nguy hiểm (công khai)
 */
router.get('/status/critical', getCriticalStockItems)

/**
 * GET /api/inventory/status/low - Lấy kho tồn kho thấp (công khai)
 */
router.get('/status/low', getLowStockItems)

/**
 * GET /api/inventory/category/:category - Lấy kho theo danh mục (công khai)
 */
router.get('/category/:category', getInventoryByCategory)

/**
 * POST /api/inventory - Tạo mục kho
 * Yêu cầu: AUTH + inventoryManagement permission (MANAGER, ADMIN)
 */
router.post(
  '/',
  authMiddleware,
  permissionCheckMiddleware('inventoryManagement'),
  createInventory
)

/**
 * GET /api/inventory/:id - Lấy chi tiết kho
 * Yêu cầu: AUTH (all roles)
 */
router.get(
  '/:id',
  authMiddleware,
  getInventoryById
)

/**
 * PUT /api/inventory/:id - Cập nhật mục kho
 * Yêu cầu: AUTH + inventoryManagement permission
 */
router.put(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('inventoryManagement'),
  updateInventory
)

/**
 * DELETE /api/inventory/:id - Xóa mục kho
 * Yêu cầu: AUTH + inventoryManagement permission (ADMIN only)
 */
router.delete(
  '/:id',
  authMiddleware,
  permissionCheckMiddleware('inventoryManagement'),
  deleteInventory
)

/**
 * POST /api/inventory/:id/restock - Nhập kho
 * Body: { quantity }
 * Yêu cầu: AUTH + inventoryManagement permission
 */
router.post(
  '/:id/restock',
  authMiddleware,
  permissionCheckMiddleware('inventoryManagement'),
  restockInventory
)

export default router
