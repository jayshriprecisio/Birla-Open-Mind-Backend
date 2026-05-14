const service = require('../services/school-enquiry.service');
const ApiResponse = require('../utils/api-response');
const ApiError = require('../utils/api-error');

const admissionInquiryByPhoneController = async (req, res, next) => {
  try {
    const { phone } = req.query;
    const data = await service.findAdmissionInquiryByPhoneService(phone);
    res.status(200).json(new ApiResponse(200, data, 'Admission inquiry found'));
  } catch (error) {
    next(error);
  }
};

const listSchoolEnquiriesController = async (req, res, next) => {
  try {
    const data = await service.listSchoolEnquiriesFilteredService(req.query);
    res.status(200).json(new ApiResponse(200, data, 'School enquiries retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const updateSchoolEnquiryStatusController = async (req, res, next) => {
  try {
    const { enquiry_id, status } = req.body;
    const data = await service.updateSchoolEnquiryStatusService(enquiry_id, status, req.user.id);
    if (!data) {
      throw new ApiError(404, 'Enquiry not found');
    }
    res.status(200).json(new ApiResponse(200, data, 'Status updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteSchoolEnquiryController = async (req, res, next) => {
  try {
    const { enquiry_id } = req.query;
    const data = await service.softDeleteSchoolEnquiryService(enquiry_id, req.user.id);
    if (!data) {
      throw new ApiError(404, 'Enquiry not found');
    }
    res.status(200).json(new ApiResponse(200, data, 'Enquiry deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const createSchoolEnquiryController = async (req, res, next) => {
  try {
    const data = await service.createSchoolEnquiryService(req.user.id, req.body);
    res.status(201).json(new ApiResponse(201, data, 'Enquiry created successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  admissionInquiryByPhoneController,
  listSchoolEnquiriesController,
  updateSchoolEnquiryStatusController,
  deleteSchoolEnquiryController,
  createSchoolEnquiryController,
};
