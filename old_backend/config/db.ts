import { Pool, PoolConfig } from 'pg';

/**
 * Connection pool tuned via env for multi-tenant scale.
 * At very large scale, put PgBouncer (transaction mode) in front of Postgres and keep `max` modest per app instance.
 */
const poolConfig: PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  max: Number(process.env.DB_POOL_MAX || 20),
  idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_MS || 30_000),
  connectionTimeoutMillis: Number(
    process.env.DB_POOL_CONNECT_TIMEOUT_MS || 10_000
  ),
  ...(process.env.DB_SSL === 'true'
    ? { ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } }
    : {}),
};

export const pool = new Pool(poolConfig);