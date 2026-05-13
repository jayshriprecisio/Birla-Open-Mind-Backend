const repository = require('./admission-inquiries.repository');

const listAdmissionInquiriesService = (args) => {
  return repository.listAdmissionInquiriesRepo(args);
};

const updateAdmissionInquiryStatusService = (id, status) => {
  return repository.updateAdmissionInquiryStatusRepo(id, status.toUpperCase());
};

const createAdmissionInquiryService = (input) => {
  return repository.createAdmissionInquiryRepo({
    school: input.school,
    grade: input.grade,
    parent_first_name: input.parent_first_name,
    parent_last_name: input.parent_last_name,
    email: input.email,
    phone_number: input.phone_number,
    comment: input.comment,
    relation: input.relation,
  });
};

const softDeleteAdmissionInquiryService = (id, deletedBy) => {
  return repository.softDeleteAdmissionInquiryRepo(id, deletedBy);
};

module.exports = {
  listAdmissionInquiriesService,
  updateAdmissionInquiryStatusService,
  createAdmissionInquiryService,
  softDeleteAdmissionInquiryService,
};
