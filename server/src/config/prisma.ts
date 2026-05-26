import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Single shared PrismaClient instance.
 * In dev, reuse across hot-reloads to avoid exhausting DB connections.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProd ? ['error'] : ['query', 'warn', 'error'],
  });

if (!env.isProd) globalForPrisma.prisma = prisma;
