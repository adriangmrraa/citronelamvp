module.exports = {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/citronela',
  },
};