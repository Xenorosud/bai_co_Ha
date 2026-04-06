/**
 * Generate ID utilities - Tạo ID duy nhất
 */

/**
 * Tạo Order ID theo format ORD-XXXXX
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}${random}`;
}

/**
 * Tạo Invoice ID theo format INV-XXXXX
 */
export function generateInvoiceId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp}${random}`;
}

/**
 * Tạo Transaction ID theo format TXN-XXXXX
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TXN-${timestamp}${random}`;
}
