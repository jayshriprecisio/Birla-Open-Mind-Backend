const lookupsRepository = require('./lookups.repository');
const ApiResponse = require('../../../utils/api-response');

const listSchoolsController = async (req, res, next) => {
  try {
    const data = await lookupsRepository.listActiveSchoolsForEnquiryRepo();
    res.status(200).json(new ApiResponse(200, data, 'Schools retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const listGradesController = async (req, res, next) => {
  try {
    const data = await lookupsRepository.listActiveGradesForEnquiryRepo();
    res.status(200).json(new ApiResponse(200, data, 'Grades retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listSchoolsController,
  listGradesController,
};
