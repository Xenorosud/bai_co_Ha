/**
 * Auth Service - Mock service
 */

import { ApiError } from '../middleware/errorHandler';

export async function register(email: string, password: string) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function login(email: string, password: string) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}

export async function refreshToken(refreshToken: string) {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'Tính năng đang phát triển');
}
