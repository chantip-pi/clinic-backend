const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to connect to PostgreSQL');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.PGSSLMODE === 'disable'
      ? false
      : {
          rejectUnauthorized: false
        }
});

const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to the PostgreSQL database');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = {
  pool,
  connectDB
};