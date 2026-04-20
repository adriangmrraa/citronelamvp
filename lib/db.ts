import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

// Enable connection caching for better performance (per official docs)
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL!;

// Create neon client
const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

// Export schema for type inference
export { schema };
export type Database = typeof db;