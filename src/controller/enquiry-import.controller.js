
const fs = require('fs');



const uploadEnquiryFileController = async (req, res, next) => {
  try {

    const { school_id } = req.body;

    console.log('FILE PATH:', req.file.path);
console.log('EXISTS:', fs.existsSync(req.file.path));

console.log('HEADERS:', req.headers['content-type']);
console.log('BODY:', req.body);
console.log('FILE:', req.file);

    if (!school_id) {
      throw new Error('school_id is required');
    }

    if (!req.file) {
      throw new Error('file is required');
    }

    const data = await service.uploadEnquiryFileService({
      school_id,
      file: req.file,
      uploaded_by: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      data,
      message: 'File uploaded successfully',
    });

  } catch (error) {
    next(error);
  }
};