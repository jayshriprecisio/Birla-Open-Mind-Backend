const repository = require('../repository/admission-inquiry.repository');

async function listAdmissionInquiriesService(queryParams) {
  const page = parseInt(queryParams.page || '1', 10);
  const limit = parseInt(queryParams.limit || '10', 10);
  return repository.listAdmissionInquiriesRepo({ ...queryParams, page, limit });
}

async function updateAdmissionInquiryStatusService(id, status) {
  return repository.updateAdmissionInquiryStatusRepo(id, status);
}

async function softDeleteAdmissionInquiryService(id, deletedBy) {
  return repository.softDeleteAdmissionInquiryRepo(id, deletedBy);
}

async function createAdmissionInquiryService(args) {
  return repository.createAdmissionInquiryRepo(args);
}

async function getAdmissionInquiryByPhoneService(phone) {
  return repository.getAdmissionInquiryByPhoneRepo(phone);
}

module.exports = {
  listAdmissionInquiriesService,
  updateAdmissionInquiryStatusService,
  softDeleteAdmissionInquiryService,
  createAdmissionInquiryService,
  getAdmissionInquiryByPhoneService,
};

