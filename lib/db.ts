import { PrismaClient } from '@prisma/client';
import { env } from '@/lib/env';

let prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient | null {
  if (!env.bool.ENABLE_DB) return null;
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

