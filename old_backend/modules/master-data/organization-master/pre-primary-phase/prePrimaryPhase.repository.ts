import { pool } from '@/backend/config/db';

export const createPrePrimaryPhaseRepo = async ({
  phaseName,
  status,
  createdBy,
}: {
  phaseName: string;
  status: string;
  createdBy: string | null;
}) => {
  return pool.query(
    `
    INSERT INTO pre_primary_phase_master
      (phase_name, status, is_deleted, created_by)
    VALUES
      ($1, $2, FALSE, $3)
    RETURNING id::text, phase_name, status, created_at, updated_at
    `,
    [phaseName, status, createdBy]
  );
};

export const listPrePrimaryPhasesRepo = async () => {
  return pool.query(
    `
    SELECT id::text AS id, phase_name, status, created_at, updated_at
    FROM pre_primary_phase_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC
    `
  );
};

export const existsPrePrimaryPhaseNameRepo = ({
  phaseName,
  excludeId,
}: {
  phaseName: string;
  excludeId?: string | number;
}) => {
  return pool.query(
    `
    SELECT 1
    FROM pre_primary_phase_master
    WHERE LOWER(TRIM(phase_name)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1
    `,
    [phaseName, excludeId ?? null]
  );
};

export const updatePrePrimaryPhaseRepo = async ({
  id,
  phaseName,
  status,
  updatedBy,
}: {
  id: string | number;
  phaseName: string;
  status: string;
  updatedBy: string | null;
}) => {
  return pool.query(
    `
    UPDATE pre_primary_phase_master
    SET phase_name = $2, status = $3, updated_by = $4, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, phase_name, status, created_at, updated_at
    `,
    [id, phaseName, status, updatedBy]
  );
};

export const softDeletePrePrimaryPhaseRepo = (id: string | number) => {
  return pool.query(
    `
    UPDATE pre_primary_phase_master
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id]
  );
};
