/**
 * Inventory Service - Mock service
 */

import { prisma } from '../utils/database';
import { ApiError } from '../middleware/errorHandler';

export async function getAllInventory(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [inventory, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        skip,
        take: limit,
        include: { supplier: true },
        orderBy: { name: 'asc' },
      }),
      prisma.inventoryItem.count(),
    ]);

    return {
      inventory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in getAllInventory:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

export async function getInventoryById(id: number) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function createInventoryItem(data: any) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function updateInventoryItem(id: number, data: any) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function deleteInventoryItem(id: number) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}
