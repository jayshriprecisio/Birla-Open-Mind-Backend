const repository = require('../repository/school-enquiry.repository');

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
  return result ?? null;
};

const softDeleteSchoolEnquiryService = async (enquiryId, userId) => {
  const result = await repository.softDeleteSchoolEnquiryRepo(enquiryId, userId);
  return result ?? null;
};

module.exports = {
  findAdmissionInquiryByPhoneService,
  createSchoolEnquiryService,
  listSchoolEnquiriesFilteredService,
  updateSchoolEnquiryStatusService,
  softDeleteSchoolEnquiryService,
};
