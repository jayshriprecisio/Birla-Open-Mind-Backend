import { pool } from '@/backend/config/db';

export const parameterExistsRepo = (parameterId: string | number) =>
  pool.query(
    `
    SELECT 1 FROM parameter_master
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    LIMIT 1`,
    [parameterId]
  );

export const createPpMappingRepo = async (args: {
  gradeName: string;
  domainName: string;
  skillName: string;
  parameterId: string;
  status: string;
  createdBy: string | null;
}) =>
  pool.query(
    `
    INSERT INTO pp_grade_domain_skill_mapping
      (grade_name, domain_name, skill_name, parameter_id, status, is_deleted, created_by)
    VALUES ($1, $2, $3, $4::bigint, $5, FALSE, $6)
    RETURNING id::text, grade_name, domain_name, skill_name,
      parameter_id::text, status, created_at, updated_at
    `,
    [
      args.gradeName,
      args.domainName,
      args.skillName,
      args.parameterId,
      args.status,
      args.createdBy,
    ]
  );

export const listPpMappingsRepo = async () =>
  pool.query(`
    SELECT
      m.id::text AS id,
      m.grade_name,
      m.domain_name,
      m.skill_name,
      m.parameter_id::text AS parameter_id,
      COALESCE(p.parameter_name, '') AS parameter_name,
      m.status,
      m.created_at,
      m.updated_at
    FROM pp_grade_domain_skill_mapping m
    LEFT JOIN parameter_master p
      ON p.id = m.parameter_id AND COALESCE(p.is_deleted, FALSE) = FALSE
    WHERE COALESCE(m.is_deleted, FALSE) = FALSE
    ORDER BY m.id ASC`);

export const existsPpMappingDuplicateRepo = (args: {
  gradeName: string;
  domainName: string;
  skillName: string;
  parameterId: string;
  excludeId?: string | number;
}) =>
  pool.query(
    `
    SELECT 1 FROM pp_grade_domain_skill_mapping
    WHERE LOWER(TRIM(grade_name)) = LOWER(TRIM($1))
      AND LOWER(TRIM(domain_name)) = LOWER(TRIM($2))
      AND LOWER(TRIM(skill_name)) = LOWER(TRIM($3))
      AND parameter_id = $4::bigint
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($5::bigint IS NULL OR id <> $5::bigint)
    LIMIT 1`,
    [
      args.gradeName,
      args.domainName,
      args.skillName,
      args.parameterId,
      args.excludeId ?? null,
    ]
  );

export const updatePpMappingRepo = async (args: {
  id: string | number;
  gradeName: string;
  domainName: string;
  skillName: string;
  parameterId: string;
  status: string;
  updatedBy: string | null;
}) =>
  pool.query(
    `
    UPDATE pp_grade_domain_skill_mapping
    SET
      grade_name = $2,
      domain_name = $3,
      skill_name = $4,
      parameter_id = $5::bigint,
      status = $6,
      updated_by = $7,
      updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, grade_name, domain_name, skill_name,
      parameter_id::text, status, created_at, updated_at
    `,
    [
      args.id,
      args.gradeName,
      args.domainName,
      args.skillName,
      args.parameterId,
      args.status,
      args.updatedBy,
    ]
  );

export const softDeletePpMappingRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE pp_grade_domain_skill_mapping
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );
