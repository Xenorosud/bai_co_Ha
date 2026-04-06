/**
 * Database utilities - Prisma instance và helpers
 */

import { PrismaClient } from '@prisma/client';

// Singleton Prisma instance
declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
