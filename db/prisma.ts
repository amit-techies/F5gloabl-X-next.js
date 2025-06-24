import * as dotenv from 'dotenv';
dotenv.config();

import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Set up WebSocket support for Neon
neonConfig.webSocketConstructor = ws;

// Ensure connection string is available
console.log('test', process.env.DATABASE_URL)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ DATABASE_URL is not set in .env');
}

// Create Neon pool
const pool = new Pool({ connectionString });

// Create Prisma adapter using the pool
const adapter = new PrismaNeon(pool);

// Export Prisma Client instance with adapter and $extends
export const prisma = new PrismaClient({adapter}).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString(); 
        },
      },
    },
  },
});
