const { pool } = require('../../../config/db');

const listActiveSchoolsForEnquiryRepo = async () => {
  const result = await pool.query(
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
  return result.rows;
};

const listActiveGradesForEnquiryRepo = async () => {
  const result = await pool.query(
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
  return result.rows;
};

module.exports = {
  listActiveSchoolsForEnquiryRepo,
  listActiveGradesForEnquiryRepo,
};
