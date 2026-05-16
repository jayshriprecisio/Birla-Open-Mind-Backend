const repository = require('../repository/student-admissions.repository');

const createAdmissionService = async (data) => {
  return await repository.createAdmissionRepo(data);
};

const getAllAdmissionsService = async (queryParams) => {
  const page = parseInt(queryParams.page || "1", 10);
  const limit = parseInt(queryParams.limit || "10", 10);
  return await repository.getAllAdmissionsRepo({ ...queryParams, page, limit });
};

const getAdmissionStatsService = async () => {
  return await repository.getAdmissionStatsRepo();
};


const getAdmissionBySearchService = async (args) => {
  return await repository.getAdmissionBySearchRepo(args);
};

const getAdmissionByIdService = async (id) => {
  return await repository.getAdmissionByIdRepo(id);
};

const updateAdmissionService = async (id, data) => {
  return await repository.updateAdmissionRepo(id, data);
};

const deleteAdmissionService = async (id, deletedBy) => {
  return await repository.deleteAdmissionRepo(id, deletedBy);
};

const cancelAdmissionService = async (id) => {
  return await repository.updateAdmissionRepo(id, { status: 'CANCELLED' });
};


module.exports = {
  createAdmissionService,
  getAllAdmissionsService,
  getAdmissionStatsService,
  getAdmissionBySearchService,
  getAdmissionByIdService,
  updateAdmissionService,
  deleteAdmissionService,
  cancelAdmissionService
};
