const repository =
  require('../repository/enquiry-import.repository');

const uploadEnquiryFileService = async (
  payload
) => {

  return repository.createImportBatchRepo({
    school_id: payload.school_id,

    file_name: payload.file.originalname,

    file_path: payload.file.path,

    uploaded_by: payload.uploaded_by,
  });
};

module.exports = {
  uploadEnquiryFileService,
};