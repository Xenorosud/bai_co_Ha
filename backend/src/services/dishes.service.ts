/**
 * Dishes Service - Xử lý logic nghiệp vụ cho món ăn
 */

import { prisma } from '../utils/database';
import { ApiError } from '../middleware/errorHandler';
import { ERROR_MESSAGES } from '../utils/constants';

export interface CreateDishData {
  name: string;
  description: string;
  price: number;
  image: string;
  typeId: number;
}

export interface UpdateDishData {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  typeId?: number;
  availability?: boolean;
}

/**
 * Lấy tất cả món ăn có phân trang
 */
export async function getAllDishes(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [dishes, total] = await Promise.all([
      prisma.dish.findMany({
        skip,
        take: limit,
        include: {
          dishType: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.dish.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      dishes,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    };
  } catch (error) {
    console.error('Error in getAllDishes:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

/**
 * Tìm kiếm món ăn theo tên
 */
export async function searchDishes(search: string) {
  try {
    return await prisma.dish.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        type: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error('Error in searchDishes:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi tìm kiếm món ăn');
  }
}

/**
 * Lấy chi tiết món ăn theo ID
 */
export async function getDishById(id: number) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        type: true,
      },
    });

    if (!dish) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy món ăn');
    }

    return dish;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error in getDishById:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

/**
 * Tạo món ăn mới
 */
export async function createDish(data: CreateDishData) {
  try {
    // Kiểm tra xem loại món ăn có tồn tại không
    const dishType = await prisma.dishType.findUnique({
      where: { id: data.typeId },
    });

    if (!dishType) {
      throw new ApiError(400, 'INVALID_TYPE', 'Loại món ăn không tồn tại');
    }

    // Tạo món ăn mới
    const dish = await prisma.dish.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        typeId: data.typeId,
        availability: true,
      },
      include: {
        type: true,
      },
    });

    return dish;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error in createDish:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi tạo món ăn');
  }
}

/**
 * Cập nhật món ăn
 */
export async function updateDish(id: number, data: UpdateDishData) {
  try {
    // Kiểm tra món ăn có tồn tại không
    const existingDish = await prisma.dish.findUnique({ where: { id } });
    if (!existingDish) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy món ăn');
    }

    // Kiểm tra loại món ăn nếu được cung cấp
    if (data.typeId) {
      const dishType = await prisma.dishType.findUnique({
        where: { id: data.typeId },
      });
      if (!dishType) {
        throw new ApiError(400, 'INVALID_TYPE', 'Loại món ăn không tồn tại');
      }
    }

    // Cập nhật món ăn
    const dish = await prisma.dish.update({
      where: { id },
      data,
      include: {
        type: true,
      },
    });

    return dish;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error in updateDish:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi cập nhật món ăn');
  }
}

/**
 * Xóa món ăn
 */
export async function deleteDish(id: number) {
  try {
    // Kiểm tra món ăn có tồn tại không
    const existingDish = await prisma.dish.findUnique({ where: { id } });
    if (!existingDish) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy món ăn');
    }

    // Soft delete - chỉ ẩn món ăn
    await prisma.dish.update({
      where: { id },
      data: { availability: false },
    });

    return { id, message: 'Món ăn đã được ẩn khỏi thực đơn' };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Error in deleteDish:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi xóa món ăn');
  }
}

/**
 * Lấy món ăn theo loại
 */
export async function getDishesByType(typeId: number) {
  try {
    const dishes = await prisma.dish.findMany({
      where: {
        typeId,
        availability: true,
      },
      include: {
        type: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return dishes;
  } catch (error) {
    console.error('Error in getDishesByType:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn món ăn theo loại');
  }
}
