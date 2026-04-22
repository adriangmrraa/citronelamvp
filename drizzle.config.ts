require('dotenv').config({ path: '.env.local' });

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/citronela',
  },
};