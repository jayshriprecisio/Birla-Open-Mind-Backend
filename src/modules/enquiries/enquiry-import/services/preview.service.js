const ApiError = require('../../../../utils/api-error');
const importBatchRepo = require('../repositories/importBatch.repository');
const importRowsRepo = require('../repositories/importRows.repository');

function serializeRow(row) {
  const j = row.toJSON ? row.toJSON() : row;
  return {
    id: j.id,
    row_number: j.row_number,
    grade_name: j.grade_name,
    grade_id: j.grade_id,
    parent_first_name: j.parent_first_name,
    parent_last_name: j.parent_last_name,
    relationship_with_student: j.relationship_with_student,
    email: j.email,
    phone_number: j.phone_number,
    source: j.source,
    counsellor_name: j.counsellor_name,
    comment: j.comment,
    validation_status: j.validation_status,
    validation_errors: j.validation_errors,
    is_duplicate: j.is_duplicate,
    is_imported: j.is_imported,
    imported_enquiry_id: j.imported_enquiry_id,
  };
}

/**
 * Preview uses enquiry_import_rows only (no Excel re-parse).
 * @param {number|string} batchId
 * @param {{ page?: number|string, limit?: number|string }} query
 */
async function getPreview(batchId, query = {}) {
  const id = Number(batchId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new ApiError(400, 'Invalid batch id');
  }

  const batch = await importBatchRepo.findBatchById(id);
  if (!batch) {
    throw new ApiError(404, 'Batch not found');
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
  const offset = (page - 1) * limit;

  const rows = await importRowsRepo.listRowsByBatch(id, { limit, offset });

  return {
    batch_id: batch.id,
    import_status: batch.import_status,
    school_id: batch.school_id,
    summary: {
      total: batch.total_rows,
      valid: batch.valid_rows,
      invalid: batch.invalid_rows,
      duplicates: batch.duplicate_rows,
    },
    page,
    limit,
    rows: rows.map(serializeRow),
  };
}

module.exports = {
  getPreview,
};
