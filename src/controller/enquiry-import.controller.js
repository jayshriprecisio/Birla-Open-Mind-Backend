const service = require('../services/enquiry-import.se;rvice');
const ApiResponse = require('../utils/api-response');
const { updateAdmissionController } = require('./student-admissions.controller');


const uploadEnquiryFileController = async (req, resizeBy, next) => {
    try {
        const data = await service.uploadEnquiryFileService({
            school_id: req.body.school_id,
            file: req.file,
            uploaded_by: req.user.id,
        })

        return resizeBy.status(201).json(new ApiResponse(201, data, 'File uploaded successfully'))

    } catch (e) {
        next(e)
    }
}

module.exports = uploadEnquiryFileController;