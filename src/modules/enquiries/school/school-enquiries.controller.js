const service = require('./school-enquiries.service');
const ApiResponse = require('../../../utils/api-response');
const ApiError = require('../../../utils/api-error');

const createSchoolEnquiryController = async (req, res, next) => {
  try {
    const data = await service.createSchoolEnquiryService(req.user?.id, req.body);
    res.status(201).json(new ApiResponse(201, data, 'Enquiry created successfully'));
  } catch (error) {
    next(error);
  }
};

const listSchoolEnquiriesController = async (req, res, next) => {
  try {
    const data = await service.listSchoolEnquiriesFilteredService(req.query);
    res.status(200).json(new ApiResponse(200, data, 'Enquiries retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const updateSchoolEnquiryStatusController = async (req, res, next) => {
  try {
    const data = await service.updateSchoolEnquiryStatusService(
      req.params.enquiryId,
      req.body.status,
      req.user?.id
    );
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
    const data = await service.softDeleteSchoolEnquiryService(req.params.enquiryId, req.user?.id);
    if (!data) {
      throw new ApiError(404, 'Enquiry not found');
    }
    res.status(200).json(new ApiResponse(200, data, 'Enquiry deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchoolEnquiryController,
  listSchoolEnquiriesController,
  updateSchoolEnquiryStatusController,
  deleteSchoolEnquiryController,
};
