const { EnquiryImportBatch } = require('../../../../models');
const { SourceMaster } = require('../../../../models');
/**
 * @param {object} data
 */
async function createBatch(data) {
  return EnquiryImportBatch.create(data);
}

/**
 * @param {number|string} id
 */
async function findBatchById(id) {
  return EnquiryImportBatch.findByPk(id);
}

/**
 * @param {number|string} id
 * @param {object} patch
 * @param {import('sequelize').Transaction} [transaction]
 */
async function updateBatchById(id, patch, transaction) {
  return EnquiryImportBatch.update(patch, { where: { id }, transaction });
}



module.exports = {
  createBatch,
  findBatchById,
  updateBatchById

};
