const { validateRequired } = require('../validators/requiredFields.validator');
const { validateFormats } = require('../validators/format.validator');
const { resolveGradeId } = require('../validators/grade.validator');
const {
  mapRawToFields,
  splitParentName,
  normalizeMapped,
  normalizePhone,
} = require('../utils/normalizeRow');
const { AdmissionInquiry, GradeMaster } = require('../../../../models');
const { Op } = require('sequelize');

/**
 * @typedef {object} StagingRowPayload
 * @property {number} row_number
 * @property {string} grade_name
 * @property {number|null} grade_id
 * @property {string} parent_first_name
 * @property {string} parent_last_name
 * @property {string|null} relationship_with_student
 * @property {string} email
 * @property {string} phone_number
 * @property {string|null} source
 * @property {string|null} counsellor_name
 * @property {string|null} comment
 * @property {string} validation_status
 * @property {string[]|null} validation_errors
 * @property {boolean} is_duplicate
 */

/**
 * Build staging payloads with validation_status / errors (before DB duplicate check).
 * @param {{ row_number: number, raw: Record<string, string> }[]} parsedRows
 */
async function buildInitialStagingPayloads(parsedRows) {
  const gradeRows = await GradeMaster.findAll({
    where: { is_deleted: false },
    attributes: ['id', 'name', 'short_form'],
  });

  return parsedRows.map(({ row_number, raw }) => {
    const mapped = mapRawToFields(raw);
    const n = normalizeMapped(mapped);
    const { parent_first_name, parent_last_name } = splitParentName(n.parent_name);

    let errors = [
      ...validateRequired({
        parent_name: n.parent_name,
        phone_number: n.phone_number,
        grade_raw: n.grade_raw,
      }),
      ...validateFormats(n),
    ];

    const g = resolveGradeId(n.grade_raw, gradeRows);
    let grade_id = g.grade_id;
    if (n.grade_raw?.trim() && !grade_id) {
      errors.push(g.error || 'Invalid grade');
    }

    errors = [...new Set(errors)];

    const invalid = errors.length > 0;

    return {
      row_number,
      grade_name: n.grade_raw || null,
      grade_id: grade_id || null,
      parent_first_name,
      parent_last_name,
      relationship_with_student: n.relationship_with_student,
      email: n.email || null,
      phone_number: n.phone_number,
      source: n.source || 'IMPORT',
      counsellor_name: n.counsellor_name,
      comment: n.comment,
      validation_status: invalid ? 'INVALID' : 'PENDING',
      validation_errors: invalid ? errors : null,
      is_duplicate: false,
    };
  });
}

/**
 * Mark in-file duplicate phones (second and later rows with same normalized phone among non-INVALID rows).
 * @param {StagingRowPayload[]} rows
 */
function applyInFileDuplicateMarks(rows) {
  const eligible = rows.filter((r) => r.validation_status !== 'INVALID');
  const byPhone = new Map();
  for (const r of eligible) {
    if (!r.phone_number) continue;
    if (!byPhone.has(r.phone_number)) byPhone.set(r.phone_number, []);
    byPhone.get(r.phone_number).push(r);
  }

  for (const list of byPhone.values()) {
    if (list.length < 2) continue;
    list.sort((a, b) => a.row_number - b.row_number);
    for (let i = 1; i < list.length; i += 1) {
      const r = list[i];
      r.validation_status = 'DUPLICATE';
      r.is_duplicate = true;
      const prev = r.validation_errors && Array.isArray(r.validation_errors) ? r.validation_errors : [];
      r.validation_errors = [...prev, 'Duplicate phone in import file'];
    }
  }
}

/**
 * Mark rows whose phone already exists in admission_inquiry for this school.
 * @param {StagingRowPayload[]} rows
 * @param {string} schoolId
 */
async function applyDatabaseDuplicateMarks(rows, schoolId) {
  const candidates = rows.filter(
    (r) => r.validation_status === 'PENDING' && r.phone_number,
  );
  if (!candidates.length) return;

  const phones = [...new Set(candidates.map((c) => c.phone_number))];

  const existing = await AdmissionInquiry.findAll({
    where: {
      school_id: schoolId,
      is_deleted: false,
      phone_number: { [Op.in]: phones },
    },
    attributes: ['phone_number'],
  });

  const existingNormalized = new Set(
    existing.map((row) => normalizePhone(row.phone_number)).filter(Boolean),
  );

  for (const r of candidates) {
    if (existingNormalized.has(r.phone_number)) {
      r.validation_status = 'DUPLICATE';
      r.is_duplicate = true;
      const prev = r.validation_errors && Array.isArray(r.validation_errors) ? r.validation_errors : [];
      r.validation_errors = [...prev, 'Phone number already exists for this school'];
    } else {
      r.validation_status = 'VALID';
      r.validation_errors = null;
    }
  }
}

/**
 * @param {{ row_number: number, raw: Record<string, string> }[]} parsedRows
 * @param {string} schoolId
 * @returns {Promise<StagingRowPayload[]>}
 */
async function validateStagingRows(parsedRows, schoolId) {
  const rows = await buildInitialStagingPayloads(parsedRows);
  applyInFileDuplicateMarks(rows);

  const pendingAfterFile = rows.filter((r) => r.validation_status === 'PENDING');
  if (pendingAfterFile.length) {
    await applyDatabaseDuplicateMarks(rows, schoolId);
  }

  for (const r of rows) {
    if (r.validation_status === 'PENDING') {
      r.validation_status = 'VALID';
      r.validation_errors = null;
    }
  }

  return rows;
}

function summarizeRows(rows) {
  let valid = 0;
  let invalid = 0;
  let duplicates = 0;
  for (const r of rows) {
    if (r.validation_status === 'VALID') valid += 1;
    else if (r.validation_status === 'INVALID') invalid += 1;
    else if (r.validation_status === 'DUPLICATE') duplicates += 1;
  }
  return {
    total: rows.length,
    valid,
    invalid,
    duplicates,
  };
}

module.exports = {
  validateStagingRows,
  summarizeRows,
};
