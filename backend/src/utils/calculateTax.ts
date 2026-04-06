/**
 * Tax calculation utilities - Tính toán thuế
 */

import { TAX_RATE } from './constants';

/**
 * Tính thuế cho đơn hàng
 */
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}

/**
 * Tính tổng tiền (subtotal + tax)
 */
export function calculateTotal(subtotal: number): number {
  const tax = calculateTax(subtotal);
  return Math.round((subtotal + tax) * 100) / 100;
}
