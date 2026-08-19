import pg from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  let connectionString = process.env.DATABASE_URL || '';
  if (connectionString.startsWith('prisma+postgres://')) {
    const url = new URL(connectionString);
    const apiKey = url.searchParams.get('api_key');
    if (apiKey) {
      const b64 = apiKey.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'));
      connectionString = decoded.databaseUrl;
    }
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  prisma = new PrismaClient({ adapter });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
