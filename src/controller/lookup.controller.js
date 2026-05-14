const repository = require('../repository/lookup.repository');
const ApiResponse = require('../utils/api-response');
const { generateTextCaptcha } = require('../utils/text-captcha');

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

const getCaptchaController = async (req, res, next) => {
  try {
    const data = generateTextCaptcha();
    res.status(200).json(new ApiResponse(200, data, 'Captcha generated'));
  } catch (error) {
    next(error);
  }
};

const getEnquiryLookupsController = async (req, res, next) => {
  try {
    const schools = await repository.listSchoolsLookup();
    const grades = await repository.listGradesLookup();
    res.status(200).json(new ApiResponse(200, { schools, grades }, 'Lookups retrieved'));
  } catch (error) {
    next(error);
  }
};

const getSchoolFormLookupsController = async (req, res, next) => {
  try {
    const zones = await repository.listZonesLookup();
    const brands = await repository.listBrandsLookup();
    const boards = await repository.listBoardsLookup();
    const sessions = await repository.listSessionsLookup();
    res.status(200).json(new ApiResponse(200, { zones, brands, boards, sessions }, 'School form lookups retrieved'));
  } catch (error) {
    next(error);
  }
};


module.exports = {
  listSchoolsLookupController,
  listGradesLookupController,
  getCaptchaController,
  getEnquiryLookupsController,
  getSchoolFormLookupsController,
};
