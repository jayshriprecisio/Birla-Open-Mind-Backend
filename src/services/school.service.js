const repository = require('../repository/school.repository');


const createSchoolService = async (payload, userId) => {
  return repository.createSchoolTransaction({ ...payload, created_by: userId });
};

const listSchoolsPaginatedService = async (queryParams) => {
  const { page = 1, limit = 20, q, status, zone, board, brand, mapping, sortBy, sortOrder } = queryParams;
  return repository.listSchoolsFilteredRepo({
    page: parseInt(page),
    limit: parseInt(limit),
    q,
    status,
    zone,
    board,
    brand,
    mapping,
    sortBy,
    sortOrder
  });
};

const getSchoolsDashboardSummaryService = async () => {
  return repository.getSchoolsDashboardSummaryRepo();
};

const getSchoolByIdService = async (schoolId) => {
  return repository.getSchoolByIdRepo(schoolId);
};

const softDeleteSchoolService = async (schoolId) => {
  return repository.softDeleteSchoolRepo(schoolId);
};

const patchSchoolStatusService = async (schoolId, status) => {
  return repository.patchSchoolStatusRepo(schoolId, status);
};

const updateSchoolService = async (schoolId, payload) => {
  return repository.updateSchoolTransaction(schoolId, payload);
};


const getSchoolDropdownService = async() => {
  return repository.getSchoolDropdownRepo();
}


module.exports = {
  createSchoolService,
  listSchoolsPaginatedService,
  getSchoolsDashboardSummaryService,
  getSchoolByIdService,
  softDeleteSchoolService,
  patchSchoolStatusService,
  updateSchoolService,
  getSchoolDropdownService
};
