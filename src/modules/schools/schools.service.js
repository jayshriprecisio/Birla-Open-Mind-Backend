
const ApiError = require('../../utils/api-error');
const schoolsRepository = require('./schools.repository');

const createSchool = async (schoolBody) => {
  // Check if school code already exists
  const existingSchools = await schoolsRepository.getSchools();
  const isDuplicate = existingSchools.find(s => s.code === schoolBody.code);
  if (isDuplicate) {
    throw new ApiError(400, 'School code already taken');
  }
  return schoolsRepository.createSchool(schoolBody);
};

const querySchools = async () => {
  return schoolsRepository.getSchools();
};

const getSchoolById = async (id) => {
  const school = await schoolsRepository.getSchoolById(id);
  if (!school) {
    throw new ApiError(404, 'School not found');
  }
  return school;
};

const updateSchoolById = async (schoolId, updateBody) => {
  const school = await getSchoolById(schoolId);
  if (!school) {
    throw new ApiError(404, 'School not found');
  }
  
  // If updating code, check if it's already taken
  if (updateBody.code && updateBody.code !== school.code) {
    const existingSchools = await schoolsRepository.getSchools();
    const isDuplicate = existingSchools.find(s => s.code === updateBody.code);
    if (isDuplicate) {
        throw new ApiError(400, 'School code already taken');
    }
  }

  return schoolsRepository.updateSchoolById(schoolId, updateBody);
};

const deleteSchoolById = async (schoolId) => {
  const school = await getSchoolById(schoolId);
  if (!school) {
    throw new ApiError(404, 'School not found');
  }
  return schoolsRepository.deleteSchoolById(schoolId);
};

module.exports = {
  createSchool,
  querySchools,
  getSchoolById,
  updateSchoolById,
  deleteSchoolById,
};
