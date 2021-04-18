const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3');

module.exports = { upload, uploadFile, getFileStream, unlinkFile }