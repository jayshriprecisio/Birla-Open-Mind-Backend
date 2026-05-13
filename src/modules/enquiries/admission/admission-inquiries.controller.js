const service = require('./admission-inquiries.service');
const { verifyTextCaptcha } = require('../../../utils/text-captcha');
const ApiResponse = require('../../../utils/api-response');
const ApiError = require('../../../utils/api-error');

const listAdmissionInquiriesController = async (req, res, next) => {
  try {
    const result = await service.listAdmissionInquiriesService(req.query);
    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: { total: result.total, page: req.query.page, limit: req.query.limit },
      filters: { schools: result.schools, grades: result.grades },
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmissionInquiryStatusController = async (req, res, next) => {
  try {
    const result = await service.updateAdmissionInquiryStatusService(req.params.id, req.body.status);
    if (!result.rowCount) {
      throw new ApiError(404, 'Record not found');
    }
    res.status(200).json(new ApiResponse(200, result.rows[0], 'Status updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteAdmissionInquiryController = async (req, res, next) => {
  try {
    const deleted = await service.softDeleteAdmissionInquiryService(req.params.id, req.user?.id);
    if (!deleted) {
      throw new ApiError(404, 'Enquiry not found or already deleted.');
    }
    res.status(200).json(new ApiResponse(200, { id: deleted.id }, 'Enquiry deleted successfully.'));
  } catch (error) {
    next(error);
  }
};

const createAdmissionInquiryController = async (req, res, next) => {
  try {
    const captcha = verifyTextCaptcha(req.body.captcha_token, req.body.captcha_answer);
    if (!captcha.success) {
      throw new ApiError(400, captcha.message || 'Captcha verification failed. Please try again.');
    }

    const row = await service.createAdmissionInquiryService(req.body);
    res.status(201).json(new ApiResponse(201, {
      id: row.id,
      status: row.status,
      created_at: row.created_at,
    }, 'Enquiry submitted successfully.'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listAdmissionInquiriesController,
  updateAdmissionInquiryStatusController,
  deleteAdmissionInquiryController,
  createAdmissionInquiryController,
};
