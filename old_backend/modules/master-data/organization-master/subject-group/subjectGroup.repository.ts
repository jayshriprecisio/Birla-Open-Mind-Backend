import { pool } from '@/backend/config/db';

export const createSubjectGroupRepo = async (args: {
  subjectGroupName: string;
  status: string;
  createdBy: string | null;
}) =>
  pool.query(
    `
    INSERT INTO subject_group_master
      (subject_group_name, status, is_deleted, created_by)
    VALUES ($1, $2, FALSE, $3)
    RETURNING id::text, subject_group_name, status, created_at, updated_at
    `,
    [args.subjectGroupName, args.status, args.createdBy]
  );

export const listSubjectGroupsRepo = async () =>
  pool.query(`
    SELECT id::text AS id, subject_group_name, status, created_at, updated_at
    FROM subject_group_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);

export const existsSubjectGroupNameRepo = (
  subjectGroupName: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM subject_group_master
    WHERE LOWER(TRIM(subject_group_name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [subjectGroupName, excludeId ?? null]
  );

export const updateSubjectGroupRepo = async (args: {
  id: string | number;
  subjectGroupName: string;
  status: string;
  updatedBy: string | null;
}) =>
  pool.query(
    `
    UPDATE subject_group_master
    SET subject_group_name = $2, status = $3, updated_by = $4, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, subject_group_name, status, created_at, updated_at
    `,
    [args.id, args.subjectGroupName, args.status, args.updatedBy]
  );

export const softDeleteSubjectGroupRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE subject_group_master SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
