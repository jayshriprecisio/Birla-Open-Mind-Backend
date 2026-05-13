import { pool } from '@/backend/config/db';

export const createCourseRepo = async ({
  courseCode,
  courseName,
  status,
  createdBy,
}: {
  courseCode: string;
  courseName: string;
  status: string;
  createdBy: number;
}) => {
  return await pool.query(
    `
    INSERT INTO course_master
    (
      course_code,
      course_name,
      status,
      created_by,
      updated_by
    )
    VALUES ($1, $2, $3, $4, $4)
    RETURNING *
    `,
    [courseCode, courseName, status, createdBy]
  );
};

export const getCoursesRepo = async () => {
  return await pool.query(
    `
    SELECT
      id,
      course_code,
      course_name,
      status,
      is_deleted,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM course_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY created_at DESC
    `
  );
};

export const existsCourseNameRepo = async ({
  courseName,
  excludeId,
}: {
  courseName: string;
  excludeId?: string | number;
}) => {
  return await pool.query(
    `
    SELECT 1
    FROM course_master
    WHERE LOWER(TRIM(course_name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2)
    LIMIT 1
    `,
    [courseName, excludeId ?? null]
  );
};

export const updateCourseRepo = async ({
  id,
  courseCode,
  courseName,
  status,
  updatedBy,
}: {
  id: string | number;
  courseCode?: string;
  courseName?: string;
  status?: string;
  updatedBy: number;
}) => {
  return await pool.query(
    `
    UPDATE course_master
    SET
      course_code = COALESCE($2, course_code),
      course_name = COALESCE($3, course_name),
      status = COALESCE($4, status),
      updated_by = $5,
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING *
    `,
    [id, courseCode, courseName, status, updatedBy]
  );
};

export const softDeleteCourseByIdRepo = async ({
  id,
  updatedBy,
}: {
  id: string | number;
  updatedBy: number;
}) => {
  return await pool.query(
    `
    UPDATE course_master
    SET
      is_deleted = TRUE,
      updated_by = $2,
      updated_at = NOW()
    WHERE id = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id, updatedBy]
  );
};

export const softDeleteCourseByCodeRepo = async ({
  courseCode,
  updatedBy,
}: {
  courseCode: string;
  updatedBy: number;
}) => {
  return await pool.query(
    `
    UPDATE course_master
    SET
      is_deleted = TRUE,
      updated_by = $2,
      updated_at = NOW()
    WHERE course_code = $1
      AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [courseCode, updatedBy]
  );
};
