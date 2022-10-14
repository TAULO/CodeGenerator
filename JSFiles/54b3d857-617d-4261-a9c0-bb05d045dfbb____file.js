const multer = require('multer');

const extensionCovers = {
  'image/png': 'png',
};

const extensionBooks = {
  'text/plain': 'text',
  'application/pdf': 'pdf', 
  'application/octet-stream': 'fb2', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const extension = {
  ...extensionCovers,
  ...extensionBooks
};

const allowedTypes = Object.keys(extension);

const chosePlace = (mimetype) => {
  let path = 'public/';

  if (extensionCovers[mimetype]) {
    path += 'covers';
  } else if (extensionBooks[mimetype]) {
    path += 'books';
  }

  return path;
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, chosePlace(file.mimetype))
  },
  filename(req, file, cb) {
    if (req.body.fileName && extension[file.mimetype]) {
        cb(null, `${req.body.fileName}.${extension[file.mimetype]}`);
    } else {
      cb(null, file.originalname);
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

module.exports = multer({
  storage,
  fileFilter
});