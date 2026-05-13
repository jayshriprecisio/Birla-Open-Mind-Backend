const registrationRepo = require('./registration.repository');
const ApiError = require('../../../utils/api-error');

const searchRegistrationsService = async ({ enquiry_no, phone }) => {
  const hasEnquiryNo = enquiry_no !== undefined && enquiry_no !== null && String(enquiry_no).trim() !== '';
  const hasPhone = phone !== undefined && phone !== null && String(phone).trim() !== '';

  if (!hasEnquiryNo && !hasPhone) {
    throw new ApiError(400, 'Please provide enquiry_no or phone to search');
  }

  return registrationRepo.searchRegistrationsRepo({ enquiry_no, phone });
};

const getRegistrationByEnquiryIdService = async (enquiryId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!enquiryId || !uuidRegex.test(String(enquiryId).trim())) {
    throw new ApiError(400, 'Invalid enquiry id');
  }
  return registrationRepo.getRegistrationByEnquiryIdRepo(String(enquiryId).trim());
};

const listRegistrationsService = async (query) => {
  const { search, status, page, pageSize } = query || {};
  return registrationRepo.listRegistrationsRepo({
    search,
    status,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 50,
  });
};

module.exports = {
  searchRegistrationsService,
  getRegistrationByEnquiryIdService,
  listRegistrationsService,
};
