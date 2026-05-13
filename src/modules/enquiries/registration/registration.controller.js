const service = require('./registration.service');
const ApiResponse = require('../../../utils/api-response');
const ApiError = require('../../../utils/api-error');

const searchRegistrationsController = async (req, res, next) => {
  try {
    const { enquiry_no, phone } = req.query;
    const data = await service.searchRegistrationsService({ enquiry_no, phone });
    res.status(200).json(new ApiResponse(200, data, 'Search results retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getRegistrationByIdController = async (req, res, next) => {
  try {
    const data = await service.getRegistrationByEnquiryIdService(req.params.enquiryId);
    if (!data) {
      throw new ApiError(404, 'Registration not found');
    }
    res.status(200).json(new ApiResponse(200, data, 'Registration retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const listRegistrationsController = async (req, res, next) => {
  try {
    const data = await service.listRegistrationsService(req.query);
    res.status(200).json(new ApiResponse(200, data, 'Registrations retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchRegistrationsController,
  getRegistrationByIdController,
  listRegistrationsController,
};
