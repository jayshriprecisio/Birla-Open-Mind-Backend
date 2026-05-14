const repository = require('../repository/school-enquiry-followup.repository');
const ApiError = require('../utils/api-error');

const createFollowupService = async (payload, userId) => {
  return await repository.createFollowupRepo(payload, userId);
};

const updateFollowupService = async (followupId, payload, userId) => {
  const result = await repository.updateFollowupRepo(followupId, payload, userId);
  if (!result) {
    throw new ApiError(404, 'Follow-up not found');
  }
  return result;
};

const deleteFollowupService = async (followupId, userId) => {
  const result = await repository.deleteFollowupRepo(followupId, userId);
  if (!result) {
    throw new ApiError(404, 'Follow-up not found');
  }
  return result;
};

const getFollowupByIdService = async (followupId) => {
  const result = await repository.getFollowupByIdRepo(followupId);
  if (!result) {
    throw new ApiError(404, 'Follow-up not found');
  }
  return result;
};

const listFollowupsService = async (filters) => {
  return await repository.listFollowupsRepo(filters);
};

const findEnquiryByNoService = async (enquiryNo) => {
  const enquiry = await repository.findEnquiryByNoRepo(enquiryNo);
  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found');
  }
  return enquiry;
};

module.exports = {
  createFollowupService,
  updateFollowupService,
  deleteFollowupService,
  getFollowupByIdService,
  listFollowupsService,
  findEnquiryByNoService,
};
