import { pool } from '@/backend/config/db';

/**
 * Master picklists for school and enquiry forms.
 */

export async function listZonesForSchoolForm() {
  return pool.query<{ zone_id: string; zone_name: string }>(
    `SELECT id::text AS zone_id, zone_name FROM zone_master WHERE COALESCE(is_deleted, FALSE) = FALSE ORDER BY zone_name ASC`
  );
}

export async function listBrandsForSchoolForm() {
  return pool.query<{ brand_id: string; name: string; brand_code: string }>(
    `SELECT id::text AS brand_id, name, brand_code FROM brand_master ORDER BY name ASC`
  );
}

export async function listBoards() {
  return pool.query<{ id: string; board_name: string }>(
    `SELECT id::text, board_name FROM board_master ORDER BY board_name ASC`
  );
}

export async function listSessions() {
  return pool.query<{ id: string; session_name: string }>(
    `SELECT id::text, session_name FROM session_master ORDER BY id ASC`
  );
}

export async function listGrades() {
  return pool.query<{ id: string; grade_name: string }>(
    `SELECT id::text, grade_name FROM grade_master ORDER BY id ASC`
  );
}

export async function listBatches() {
  return pool.query<{ id: string; batch_name: string }>(
    `SELECT id::text, batch_name FROM batch_master ORDER BY batch_name ASC`
  );
}

export async function listSchools() {
  return pool.query<{ id: string; school_name: string; school_code: string; brand_code: string; zone_name: string; board: string }>(
    `SELECT s.id::text, s.school_name, s.school_code, s.brand_code, z.zone_name, s.board 
     FROM schools s
     LEFT JOIN zone_master z ON s.zone_id = z.id
     WHERE s.status = 'active' 
     ORDER BY s.school_name ASC`
  );
}

export async function listGenders() {
  return pool.query<{ id: string; gender_name: string }>(
    `SELECT id::text, gender_name FROM gender_master ORDER BY id ASC`
  );
}

export async function listAcademicYears() {
  return pool.query<{ id: string; year_label: string }>(
    `SELECT id::text, year_label FROM academic_year_master ORDER BY year_label DESC`
  );
}

