const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'medicollab_uploads',
    allowed_formats: ['jpg', 'png', 'pdf', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;