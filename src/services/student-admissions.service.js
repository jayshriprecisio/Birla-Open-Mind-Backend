const repository = require('../repository/student-admissions.repository');

/**
 * Generate a unique registration number
 * Format: REG-YYYY-XXXX (e.g., REG-2026-0001)
 */
const generateRegistrationNo = async () => {
  const year = new Date().getFullYear();
  const prefix = `REG-${year}-`;
  
  // In a real scenario, you'd get the last sequence from DB.
  // For simplicity here, we use a random number or timestamp.
  // Better: find max registration_no from DB and increment.
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}${randomStr}`;
};

const createAdmissionService = async (data) => {
  if (!data.registration_no) {
    data.registration_no = await generateRegistrationNo();
  }
  return await repository.createAdmissionRepo(data);
};

const getAllAdmissionsService = async (queryParams) => {
  const page = parseInt(queryParams.page || '1', 10);
  const limit = parseInt(queryParams.limit || '10', 10);
  return await repository.getAllAdmissionsRepo({ ...queryParams, page, limit });
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

module.exports = {
  createAdmissionService,
  getAllAdmissionsService,
  getAdmissionByIdService,
  updateAdmissionService,
  deleteAdmissionService
};
