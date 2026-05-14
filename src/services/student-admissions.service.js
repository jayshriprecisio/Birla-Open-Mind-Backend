const repository = require('../repository/student-admissions.repository');

/**
 * Generate a unique registration number
 * Format: REG-YYYY-XXXX (e.g., REG-2026-0001)
 */
const generateRegistrationNo = async () => {
  const year = new Date().getFullYear();
  const prefix = `REG-${year}-`;
  
  const lastRecord = await repository.getLastAdmissionRepo(prefix);
  let nextSeq = 1;
  
  if (lastRecord && lastRecord.registration_no) {
    const parts = lastRecord.registration_no.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }
  
  return `${prefix}${nextSeq.toString().padStart(4, '0')}`;
};

const createAdmissionService = async (data) => {
  if (!data.registration_no) {
    data.registration_no = await generateRegistrationNo();
  }
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
  getAdmissionByIdService,
  updateAdmissionService,
  deleteAdmissionService,
  cancelAdmissionService
};
