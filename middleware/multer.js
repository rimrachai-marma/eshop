const multer = require("multer");
const path = require("path");

module.exports.bufferImageUpload = multer({
  limits: {
    fileSize: 1000000,
  },

  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("Please upload an image"));
    }

    callback(undefined, true);
  },
});

module.exports.imageUpload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, "uploads/");
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),

  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      return callback(new Error("Please upload an image"));
    }

    return callback(null, true);
  },
});
