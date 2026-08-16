import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  // In Prisma 7, you must pass an adapter to connect to the database.
  // The connectionString is fetched from environment variables.
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
  });
  
  prisma = new PrismaClient({ adapter });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
