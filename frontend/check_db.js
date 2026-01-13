const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is missing in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkTables() {
  try {
    const client = await pool.connect();
    console.log('Connected to database successfully');

    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('Tables found:', res.rows.map(r => r.table_name));

    // Check if we can write to user table (simulate signup check essentially)
    // We won't actually write, just checking schema if "user" table exists
    const userTable = res.rows.find(r => r.table_name === 'user');
    if (userTable) {
        const columns = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'user'
        `);
        console.log('User table columns:', columns.rows.map(c => `${c.column_name} (${c.data_type})`));
    }

    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await pool.end();
  }
}

checkTables();
