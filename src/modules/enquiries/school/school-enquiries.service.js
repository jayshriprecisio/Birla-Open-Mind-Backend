const repository = require('./school-enquiries.repository');

const findAdmissionInquiryByPhoneService = async (phone) => {
  const r = await repository.findAdmissionInquiryByPhoneRepo(phone.trim());
  return r.rows[0] ?? null;
};

const createSchoolEnquiryService = async (userId, payload) => {
  return repository.createSchoolEnquiryRepo({ userId, payload });
};

const listSchoolEnquiriesFilteredService = async (filters) => {
  return repository.listSchoolEnquiriesFilteredRepo(filters);
};

const updateSchoolEnquiryStatusService = async (enquiryId, status, userId) => {
  const result = await repository.updateSchoolEnquiryStatusRepo(enquiryId, status, userId);
  return result.rows[0] ?? null;
};

const softDeleteSchoolEnquiryService = async (enquiryId, userId) => {
  const result = await repository.softDeleteSchoolEnquiryRepo(enquiryId, userId);
  return result.rows[0] ?? null;
};

module.exports = {
  findAdmissionInquiryByPhoneService,
  createSchoolEnquiryService,
  listSchoolEnquiriesFilteredService,
  updateSchoolEnquiryStatusService,
  softDeleteSchoolEnquiryService,
};
