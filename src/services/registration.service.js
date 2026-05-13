const repository = require('../repository/registration.repository');
const ApiError = require('../utils/api-error');

const isFilled = (v) => v !== undefined && v !== null && String(v).trim() !== '';

const searchRegistrationsService = async ({ enquiry_no, phone }) => {
  if (!isFilled(enquiry_no) && !isFilled(phone)) {
    throw new ApiError(400, 'Please provide enquiry_no or phone to search');
  }
  return repository.searchRegistrationsRepo({ enquiry_no, phone });
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
  listRegistrationsService,
};
