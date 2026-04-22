import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

function createDb() {
  const connectionString = process.env.DATABASE_URL!;
  const sql = neon(connectionString) as any;
  return drizzle(sql, { schema });
}

export const db = process.env.DATABASE_URL ? createDb() : null!;

export { schema };
export type Database = typeof db;