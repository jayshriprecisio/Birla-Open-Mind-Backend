const { EnquiryImportRow } = require('../../../../models');

/**
 * @param {number|string} batchId
 * @param {object[]} payloads — fields for enquiry_import_rows (without batch_id)
 * @param {import('sequelize').Transaction} [transaction]
 */
async function bulkCreateRows(batchId, payloads, transaction) {
  const rows = payloads.map((p) => ({
    ...p,
    batch_id: batchId,
  }));
  return EnquiryImportRow.bulkCreate(rows, { returning: true, transaction });
}

/**
 * @param {number|string} batchId
 * @param {{ limit?: number, offset?: number }} opts
 */
async function listRowsByBatch(batchId, opts = {}) {
  const limit = opts.limit != null ? Number(opts.limit) : 100;
  const offset = opts.offset != null ? Number(opts.offset) : 0;
  return EnquiryImportRow.findAll({
    where: { batch_id: batchId },
    order: [['row_number', 'ASC']],
    limit: Math.min(Math.max(limit, 1), 500),
    offset: Math.max(offset, 0),
  });
}

/**
 * @param {number|string} batchId
 */
async function findValidRowsForImport(batchId) {
  return EnquiryImportRow.findAll({
    where: {
      batch_id: batchId,
      validation_status: 'VALID',
      is_imported: false,
    },
    order: [['row_number', 'ASC']],
  });
}

/**
 * @param {number|string} rowId
 * @param {number|string} importedEnquiryId
 * @param {import('sequelize').Transaction} [transaction]
 */
async function markRowImported(rowId, importedEnquiryId, transaction) {
  return EnquiryImportRow.update(
    { is_imported: true, imported_enquiry_id: importedEnquiryId },
    { where: { id: rowId }, transaction },
  );
}

module.exports = {
  bulkCreateRows,
  listRowsByBatch,
  findValidRowsForImport,
  markRowImported,
};
