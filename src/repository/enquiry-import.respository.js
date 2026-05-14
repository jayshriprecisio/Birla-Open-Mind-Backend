const {EnquiryImportBatch} = require('../models')
const createImportBatchRepo = async(payload) => {
    return await EnquiryImportBatch.create({
        school_id: payload.school_id,
        file_name : payload.file_name,
        file_path : payload.file_path,
        uploaded_by: payload.uploaded_by,
    })
}

module.exports = {createImportBatchRepo}
