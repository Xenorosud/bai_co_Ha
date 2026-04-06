/**
 * Reservations Service - Mock service
 */

import { prisma } from '../utils/database';
import { ApiError } from '../middleware/errorHandler';

export async function getAllReservations(page: number = 1, limit: number = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        skip,
        take: limit,
        include: { table: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.reservation.count(),
    ]);

    return {
      reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in getAllReservations:', error);
    throw new ApiError(500, 'DATABASE_ERROR', 'Lỗi khi truy vấn cơ sở dữ liệu');
  }
}

export async function getReservationById(id: number) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function createReservation(data: any) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function updateReservation(id: number, data: any) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function deleteReservation(id: number) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}
