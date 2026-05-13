import { pool } from "@/backend/config/db";

export const getUserByEmail = async (email: string) => {
  const result = await pool.query(
    `SELECT *
     FROM users
     WHERE LOWER(email) = LOWER($1)
       AND COALESCE(is_active, TRUE) = TRUE
     ORDER BY created_at DESC NULLS LAST
     LIMIT 1`,
    [email]
  );

  return result.rows[0];
};

export const createPasswordResetToken = async (userId: number | string, token: string) => {
  const result = await pool.query(
    `INSERT INTO password_resets (user_id, token)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, token]
  );
  return result.rows[0];
};

export const getPasswordResetToken = async (token: string) => {
  const result = await pool.query(
    `SELECT * FROM password_resets
     WHERE token = $1
     LIMIT 1`,
    [token]
  );
  return result.rows[0];
};

export const markTokenAsUsed = async (tokenId: string) => {
  const result = await pool.query(
    `UPDATE password_resets
     SET used = TRUE
     WHERE id = $1
     RETURNING *`,
    [tokenId]
  );
  return result.rows[0];
};

export const updateUserPassword = async (userId: number | string, passwordHash: string) => {
  const result = await pool.query(
    `UPDATE users
     SET password_hash = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id`,
    [passwordHash, userId]
  );
  return result.rows[0];
};