const repository = require('../repository/lookup.repository');
const ApiResponse = require('../utils/api-response');

const listSchoolsLookupController = async (req, res, next) => {
  try {
    const data = await repository.listSchoolsLookup();
    res.status(200).json(new ApiResponse(200, data, 'Schools retrieved'));
  } catch (error) {
    next(error);
  }
};

const listGradesLookupController = async (req, res, next) => {
  try {
    const data = await repository.listGradesLookup();
    res.status(200).json(new ApiResponse(200, data, 'Grades retrieved'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listSchoolsLookupController,
  listGradesLookupController,
};
