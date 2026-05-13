const repository = require('../repository/registration.repository');
const ApiError = require('../utils/api-error');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isFilled = (v) => v !== undefined && v !== null && String(v).trim() !== '';

const searchRegistrationsService = async ({ enquiry_no, phone }) => {
  if (!isFilled(enquiry_no) && !isFilled(phone)) {
    throw new ApiError(400, 'Please provide enquiry_no or phone to search');
  }
  return repository.searchRegistrationsRepo({ enquiry_no, phone });
};

const getRegistrationByEnquiryIdService = async (enquiryId) => {
  if (!isFilled(enquiryId) || !UUID_REGEX.test(String(enquiryId).trim())) {
    throw new ApiError(400, 'Invalid enquiry id');
  }
  return repository.getRegistrationByEnquiryIdRepo(String(enquiryId).trim());
};

const listRegistrationsService = async (query) => {
  const { search, status, page, pageSize } = query || {};
  return repository.listRegistrationsRepo({
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
