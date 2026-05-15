const ApiError = require('../../../../utils/api-error');
const { sequelize } = require('../../../../models');
const importBatchRepo = require('../repositories/importBatch.repository');
const importRowsRepo = require('../repositories/importRows.repository');
const enquiryRepo = require('../repositories/enquiry.repository');

/**
 * @param {object} row — Sequelize model instance or plain
 */
function buildAdmissionComment(row) {
  const j = row.toJSON ? row.toJSON() : row;
  const parts = ['[Source: IMPORT]'];
  if (j.relationship_with_student) {
    parts.push(`Relation: ${j.relationship_with_student}`);
  }
  if (j.counsellor_name) {
    parts.push(`Counsellor: ${j.counsellor_name}`);
  }
  if (j.comment) {
    parts.push(j.comment);
  }
  return parts.join(' | ');
}

/**
 * Import VALID staging rows into admission_inquiry inside a single transaction.
 * @param {number|string} batchId
 */
async function importValidRows(batchId) {
  const id = Number(batchId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new ApiError(400, 'Invalid batch id');
  }

  const batch = await importBatchRepo.findBatchById(id);
  if (!batch) {
    throw new ApiError(404, 'Batch not found');
  }

  if (batch.import_status === 'IMPORTED') {
    throw new ApiError(400, 'This batch has already been imported');
  }

  if (batch.import_status !== 'VALIDATED') {
    throw new ApiError(400, 'Batch is not ready for import');
  }

  const rows = await importRowsRepo.findValidRowsForImport(id);
  if (!rows.length) {
    throw new ApiError(400, 'No valid rows to import');
  }

  const payloads = rows.map((r) => {
    const j = r.toJSON ? r.toJSON() : r;
    return {
      school_id: batch.school_id,
      grade_id: j.grade_id,
      phone_number: j.phone_number,
      parent_first_name: j.parent_first_name,
      parent_last_name: j.parent_last_name,
      email: j.email || null,
      comment: buildAdmissionComment(r),
      status: 'NEW',
      is_deleted: false,
    };
  });

  const transaction = await sequelize.transaction();
  try {
    const created = await enquiryRepo.bulkCreateAdmissionInquiries(payloads, {
      transaction,
    });

    await Promise.all(
      rows.map((row, i) => {
        const createdRow = created[i];
        const enquiryId = createdRow?.id;
        if (!enquiryId) {
          throw new Error('Missing id from bulk insert');
        }
        return importRowsRepo.markRowImported(row.id, enquiryId, transaction);
      }),
    );

    await importBatchRepo.updateBatchById(
      id,
      { import_status: 'IMPORTED' },
      transaction,
    );

    await transaction.commit();

    return {
      batch_id: id,
      imported_count: created.length,
      import_status: 'IMPORTED',
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = {
  importValidRows,
};
