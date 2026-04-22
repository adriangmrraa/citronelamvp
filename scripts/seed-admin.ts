/**
 * Seed script: Creates the first admin user
 *
 * Usage: npx tsx scripts/seed-admin.ts
 *
 * Requires DATABASE_URL in .env or .env.local
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '../db/schema';
import bcrypt from 'bcryptjs';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set. Create .env.local with your Neon connection string.');
    process.exit(1);
  }

  const sql = neon(databaseUrl) as any;
  const db = drizzle(sql);

  const adminPassword = await bcrypt.hash('admin123', 12);

  try {
    const [admin] = await db.insert(users).values({
      username: 'admin',
      email: 'admin@citronela.com',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      emailVerified: true,
      tokens: 10000,
      planType: 'Local',
    }).returning({ id: users.id, username: users.username });

    console.log(`\n✅ Admin user created:`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   Username: admin`);
    console.log(`   Password: admin123`);
    console.log(`   Tokens: 10000`);
    console.log(`\n⚠️  Cambiá la contraseña en producción!\n`);
  } catch (error: any) {
    if (error?.code === '23505') {
      console.log('\n⚠️  Admin user already exists. Skipping.\n');
    } else {
      throw error;
    }
  }
}

main().catch(console.error);
