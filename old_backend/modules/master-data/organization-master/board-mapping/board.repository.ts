import { pool } from '@/backend/config/db';

export const createBoardRepo = async (
  boardName: string,
  status: string,
  createdBy: number
) => {
  return await pool.query(
    `
    INSERT INTO board_master
    (
      board_code,
      board_name,
      status,
      created_by
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *
    `,
    [
      `BRD-${Date.now()}`,
      boardName,
      status,
      createdBy,
    ]
  );
};

export const getBoardsRepo = async () => {
  return await pool.query(`
    SELECT *
    FROM board_master
    ORDER BY created_at DESC
  `);
};

export const updateBoardRepo = async ({
  boardCode,
  boardName,
  status,
  updatedBy,
}: {
  boardCode: string;
  boardName?: string;
  status?: string;
  updatedBy: string;
}) => {
  return await pool.query(
    `
    UPDATE board_master
    SET
      board_name = COALESCE($2, board_name),
      status = COALESCE($3, status),
      updated_by = $4,
      updated_at = NOW()
    WHERE board_code = $1
    RETURNING *
    `,
    [boardCode, boardName, status, updatedBy]
  );
};

export const existsBoardNameRepo = async ({
  boardName,
  excludeBoardCode,
}: {
  boardName: string;
  excludeBoardCode?: string;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM board_master
    WHERE LOWER(TRIM(board_name)) = LOWER(TRIM($1))
      AND ($2::text IS NULL OR board_code <> $2)
    LIMIT 1
    `,
    [boardName, excludeBoardCode ?? null]
  );
};



export const deleteBoardRepo = async (
  boardCode: string
) => {
  return await pool.query(
    `
    DELETE FROM board_master
    WHERE board_code = $1
    `,
    [boardCode]
  );
};