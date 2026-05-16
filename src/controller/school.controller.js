const service = require('../services/school.service');
const ApiResponse = require('../utils/api-response');
const ApiError = require('../utils/api-error');

const createSchoolController = async (req, res, next) => {
  try {
    const data = await service.createSchoolService(req.body, req.user?.id);
    res.status(201).json(new ApiResponse(201, data, 'School created successfully'));
  } catch (error) {
    if (error.message.includes('A school with this code')) {
      next(new ApiError(400, error.message));
    } else {
      next(error);
    }
  }
};

const updateSchoolController = async (req, res, next) => {
  try {
    const data = await service.updateSchoolService(req.params.schoolId, req.body);
    if (!data) {
      throw new ApiError(404, 'School not found');
    }
    res.status(200).json(new ApiResponse(200, data, 'School updated successfully'));
  } catch (error) {
    if (error.message.includes('A school with this code')) {
      next(new ApiError(400, error.message));
    } else {
      next(error);
    }
  }
};

const listSchoolsController = async (req, res, next) => {
  try {
    const data = await service.listSchoolsPaginatedService(req.query);
    res.status(200).json(new ApiResponse(200, data, 'Schools retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getSchoolsDashboardSummaryController = async (req, res, next) => {
  try {
    const data = await service.getSchoolsDashboardSummaryService();
    res.status(200).json(new ApiResponse(200, data, 'Dashboard summary retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getSchoolByIdController = async (req, res, next) => {
  try {
    const data = await service.getSchoolByIdService(req.params.schoolId);
    if (!data) {
      throw new ApiError(404, 'School not found');
    }
    res.status(200).json(new ApiResponse(200, data, 'School retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const softDeleteSchoolController = async (req, res, next) => {
  try {
    const deletedCount = await service.softDeleteSchoolService(req.params.schoolId);
    if (!deletedCount) {
      throw new ApiError(404, 'School not found');
    }
    res.status(200).json(new ApiResponse(200, null, 'School deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const patchSchoolStatusController = async (req, res, next) => {
  try {
    const data = await service.patchSchoolStatusService(req.params.schoolId, req.body.status);
    if (!data) {
      throw new ApiError(404, 'School not found');
    }
    res.status(200).json(new ApiResponse(200, data, 'School status updated successfully'));
  } catch (error) {
    next(error);
  }
};
const getSchoolDropdownController = async (req, res, next) => {
  try {
    const data = await service.getSchoolDropdownService();
    res.status(200).json(new ApiResponse(200, data, 'Schools retrieved successfully'));
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createSchoolController,
  updateSchoolController,
  listSchoolsController,
  getSchoolsDashboardSummaryController,
  getSchoolByIdController,
  softDeleteSchoolController,
  patchSchoolStatusController,
  getSchoolDropdownController
  
};
