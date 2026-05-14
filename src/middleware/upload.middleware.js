const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb)  => {
        cb(null, 'uploads/enquiry-imports')
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;

        cb(null, uniqueName)
    }
});

//allow files
const allowedExtensions = [
  '.csv',
  '.xls',
  '.xlsx',
];

//validate file type
const fileFilter = (req, file, cb) => {

  const ext = path.extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(ext)) {

    return cb(
      new Error(
        'Only CSV, XLS, XLSX files are allowed'
      )
    );
  }

  cb(null, true);
};

//upload
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024,   //100MB
  },
});

module.exports = {upload}