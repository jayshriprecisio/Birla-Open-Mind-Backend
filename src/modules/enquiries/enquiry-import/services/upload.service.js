const ApiError = require('../../../../utils/api-error');
const { School } = require('../../../../models');
const { parseEnquiryImportFile } = require('../utils/excelParser');
const { validateStagingRows, summarizeRows } = require('./validation.service');
const importBatchRepo = require('../repositories/importBatch.repository');
const importRowsRepo = require('../repositories/importRows.repository');

/**
 * Upload file → batch + staging rows + validation (no re-parse on later steps).
 * @param {{ school_id: string, file: Express.Multer.File, uploaded_by?: number|null }} payload
 */
async function processUpload(payload) {
  const { school_id, file, uploaded_by } = payload;

  const school = await School.findByPk(school_id);
  if (!school) {
    throw new ApiError(400, 'Invalid school_id');
  }

  const parsed = parseEnquiryImportFile(file.path);
  if (!parsed.length) {
    throw new ApiError(400, 'No data rows found in file');
  }

  const staging = await validateStagingRows(parsed, school_id);
  const summary = summarizeRows(staging);

  const batch = await importBatchRepo.createBatch({
    school_id,
    file_name: file.originalname,
    file_path: file.path,
    uploaded_by: uploaded_by ?? null,
    total_rows: staging.length,
    valid_rows: summary.valid,
    invalid_rows: summary.invalid,
    duplicate_rows: summary.duplicates,
    import_status: 'VALIDATED',
  });

  const rowPayloads = staging.map((r) => ({
    row_number: r.row_number,
    grade_name: r.grade_name,
    grade_id: r.grade_id,
    parent_first_name: r.parent_first_name,
    parent_last_name: r.parent_last_name,
    relationship_with_student: r.relationship_with_student,
    email: r.email,
    phone_number: r.phone_number,
    source: r.source,
    counsellor_name: r.counsellor_name,
    comment: r.comment,
    validation_status: r.validation_status,
    validation_errors: r.validation_errors,
    is_duplicate: r.is_duplicate,
    is_imported: false,
  }));

  await importRowsRepo.bulkCreateRows(batch.id, rowPayloads);

  return {
    batch_id: batch.id,
    summary: {
      total: summary.total,
      valid: summary.valid,
      invalid: summary.invalid,
      duplicates: summary.duplicates,
    },
    import_status: batch.import_status,
    file_name: batch.file_name,
  };
}

module.exports = {
  processUpload,
};
