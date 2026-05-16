const upload = require('../modules/enquiries/enquiry-import/services/upload.service');
const previewMod = require('../modules/enquiries/enquiry-import/services/preview.service');
const importMod = require('../modules/enquiries/enquiry-import/services/import.service');

const uploadEnquiryFileService = (payload) => upload.processUpload(payload);

const getEnquiryImportPreviewService = (batchId, query) =>
  previewMod.getPreview(batchId, query);

const importEnquiryBatchService = (batchId) => importMod.importValidRows(batchId);

module.exports = {
  uploadEnquiryFileService,
  getEnquiryImportPreviewService,
  importEnquiryBatchService,
};
