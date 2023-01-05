const multer = require('multer');
const path = require('path');

// setup multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'storage/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
