// test-db.ts
import { sql } from '@vercel/postgres';

async function testConnection() {
  try {
    const result = await sql`SELECT 1+1 AS result`;
    console.log(result.rows);
  } catch (err) {
    console.error('Database error:', err);
  }
}

testConnection();