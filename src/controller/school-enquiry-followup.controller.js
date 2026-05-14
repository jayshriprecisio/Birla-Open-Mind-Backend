const service = require('../services/school-enquiry-followup.service');
const ApiResponse = require('../utils/api-response');

const createFollowupController = async (req, res, next) => {
  try {
    const data = await service.createFollowupService(req.body, req.user.id);
    res.status(201).json(new ApiResponse(201, data, 'Follow-up scheduled successfully'));
  } catch (error) {
    next(error);
  }
};

const updateFollowupController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.updateFollowupService(id, req.body, req.user.id);
    res.status(200).json(new ApiResponse(200, data, 'Follow-up updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteFollowupController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.deleteFollowupService(id, req.user.id);
    res.status(200).json(new ApiResponse(200, null, 'Follow-up deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const getFollowupByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.getFollowupByIdService(id);
    res.status(200).json(new ApiResponse(200, data, 'Follow-up details retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const listFollowupsController = async (req, res, next) => {
  try {
    const data = await service.listFollowupsService(req.query);
    res.status(200).json(new ApiResponse(200, data, 'Follow-ups retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const findEnquiryByNoController = async (req, res, next) => {
  try {
    const { enquiry_no } = req.params;
    const data = await service.findEnquiryByNoService(enquiry_no);
    res.status(200).json(new ApiResponse(200, data, 'Enquiry details retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFollowupController,
  updateFollowupController,
  deleteFollowupController,
  getFollowupByIdController,
  listFollowupsController,
  findEnquiryByNoController,
};
