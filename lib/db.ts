import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

// Enable connection caching for better performance (per official docs)
neonConfig.fetchConnectionCache = true;

function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  const connectionString = process.env.DATABASE_URL;
  const sql = neon(connectionString) as any;
  return drizzle(sql, { schema });
}

// Create DB connection - will throw at runtime if DATABASE_URL not set
export const db = process.env.DATABASE_URL ? createDb() : null!;

// Re-export schema for type inference
export { schema };
export type Database = typeof db;