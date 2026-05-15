const uploadSingle = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        url: fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadMultiple = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const filesData = req.files.map(file => ({
      filename: file.filename,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    }));

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: filesData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
