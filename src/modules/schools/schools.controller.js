const ApiResponse = require('../../utils/api-response');
const schoolsService = require('./schools.service');

const createSchool = async (req, res, next) => {
  try {
    const school = await schoolsService.createSchool(req.body);
    res.status(201).json(new ApiResponse(201, school, 'School created successfully'));
  } catch (error) {
    next(error);
  }
};

const getSchools = async (req, res, next) => {
  try {
    const schools = await schoolsService.querySchools();
    res.status(200).json(new ApiResponse(200, schools, 'Schools retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

const getSchool = async (req, res, next) => {
  try {
    const school = await schoolsService.getSchoolById(req.params.schoolId);
    res.status(200).json(new ApiResponse(200, school, 'School retrieved successfully'));
  } catch (error) {
    next(error);
  }
};    

const updateSchool = async (req, res, next) => {
  try {
    const school = await schoolsService.updateSchoolById(req.params.schoolId, req.body);
    res.status(200).json(new ApiResponse(200, school, 'School updated successfully'));
  } catch (error) {
    next(error);
  }
};

const deleteSchool = async (req, res, next) => {
  try {
    await schoolsService.deleteSchoolById(req.params.schoolId);
    res.status(200).json(new ApiResponse(200, null, 'School deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool,
};
