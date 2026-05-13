const service = require('../services/admission-inquiry.service');
const ApiResponse = require('../utils/api-response');
const ApiError = require('../utils/api-error');

async function listAdmissionInquiriesController(req, res, next) {
  try {
    const data = await service.listAdmissionInquiriesService(req.query);
    res.status(200).json(new ApiResponse(200, data, 'Admission inquiries retrieved'));
  } catch (error) {
    next(error);
  }
}

async function updateAdmissionInquiryStatusController(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await service.updateAdmissionInquiryStatusService(id, status);
    if (!data) throw new ApiError(404, 'Inquiry not found');
    res.status(200).json(new ApiResponse(200, data, 'Status updated'));
  } catch (error) {
    next(error);
  }
}

async function softDeleteAdmissionInquiryController(req, res, next) {
  try {
    const { id } = req.params;
    const data = await service.softDeleteAdmissionInquiryService(id, req.user?.id);
    if (!data) throw new ApiError(404, 'Inquiry not found');
    res.status(200).json(new ApiResponse(200, data, 'Inquiry deleted'));
  } catch (error) {
    next(error);
  }
}

async function createAdmissionInquiryController(req, res, next) {
  try {
    const data = await service.createAdmissionInquiryService(req.body);
    res.status(201).json(new ApiResponse(201, data, 'Inquiry submitted successfully'));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAdmissionInquiriesController,
  updateAdmissionInquiryStatusController,
  softDeleteAdmissionInquiryController,
  createAdmissionInquiryController,
};
