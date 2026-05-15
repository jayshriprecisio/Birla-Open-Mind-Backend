const service = require('../services/enquiry-import.service');
const ApiError = require('../utils/api-error');

const uploadEnquiryFileController = async (req, res, next) => {
  try {
    const { school_id } = req.body;
    if (!school_id) {
      throw new ApiError(400, 'school_id is required');
    }
    if (!req.file) {
      throw new ApiError(400, 'file is required');
    }

    const data = await service.uploadEnquiryFileService({
      school_id,
      file: req.file,
      uploaded_by: req.user?.id ?? null,
    });

    return res.status(201).json({
      success: true,
      data,
      message: 'File uploaded and validated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const previewEnquiryImportController = async (req, res, next) => {
  try {
    const data = await service.getEnquiryImportPreviewService(
      req.params.batchId,
      req.query,
    );
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const importEnquiryBatchController = async (req, res, next) => {
  try {
    const data = await service.importEnquiryBatchService(req.params.batchId);
    return res.status(200).json({
      success: true,
      data,
      message: 'Import completed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadEnquiryFileController,
  previewEnquiryImportController,
  importEnquiryBatchController,
};
