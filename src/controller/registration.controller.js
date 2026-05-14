const service = require('../services/registration.service');
const ApiResponse = require('../utils/api-response');

const searchRegistrationsController = async (req, res, next) => {
  try {
    const { enquiry_no, phone } = req.query;
    const data = await service.searchRegistrationsService({ enquiry_no, phone });

    // Check if no records found
    const message = data.length === 0
      ? phone
        ? `No entry found with phone number ${phone}`
        : enquiry_no
          ? `No entry found with enquiry number ${enquiry_no}`
          : 'No matching entries found'
          : 'Search results retrieved successfully';

    res.status(200).json(new ApiResponse(200, data, message));
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
  listRegistrationsController,
};
