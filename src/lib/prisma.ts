// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// We use a singleton pattern to ensure only one PrismaClient instance is used
// in the application, which is important for preventing multiple connections
// especially during development hot-reloading.
declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;