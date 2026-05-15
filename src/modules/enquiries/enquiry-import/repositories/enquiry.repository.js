const { AdmissionInquiry } = require('../../../../models');

/**
 * @param {object[]} rows
 * @param {{ transaction?: import('sequelize').Transaction }} opts
 */
async function bulkCreateAdmissionInquiries(rows, opts = {}) {
  return AdmissionInquiry.bulkCreate(rows, {
    returning: true,
    transaction: opts.transaction,
  });
}

module.exports = {
  bulkCreateAdmissionInquiries,
};
