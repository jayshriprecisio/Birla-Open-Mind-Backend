import { pool } from '@/backend/config/db';

export type SchoolLookupRow = {
  id: string;
  name: string;
  code: string;
};

export type GradeLookupRow = {
  id: string;
  name: string;
  short_form: string | null;
};

/**
 * Active schools for the public Enquiry form.
 * Excludes soft-deleted and non-active rows.
 */
export async function listActiveSchoolsForEnquiryRepo(): Promise<SchoolLookupRow[]> {
  const r = await pool.query<SchoolLookupRow>(
    `
    SELECT
      school_id::text  AS id,
      school_name      AS name,
      school_code      AS code
    FROM schools
    WHERE deleted_at IS NULL
      AND LOWER(COALESCE(status, 'active')) = 'active'
    ORDER BY school_name ASC
    `
  );
  return r.rows;
}

/**
 * Active grades for the public Enquiry form.
 * Honors display_order so the form list matches admin ordering.
 */
export async function listActiveGradesForEnquiryRepo(): Promise<GradeLookupRow[]> {
  const r = await pool.query<GradeLookupRow>(
    `
    SELECT
      id::text   AS id,
      name,
      short_form
    FROM grade_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
      AND UPPER(COALESCE(status, 'ACTIVE')) = 'ACTIVE'
    ORDER BY COALESCE(display_order, 9999) ASC, id ASC
    `
  );
  return r.rows;
}
