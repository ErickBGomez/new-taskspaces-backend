import multer from 'multer';
import path from 'path';
import { FileNotSupportedError } from '../errors/media.errors.js';

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/media/'); // TODO: Save files in upload folder. Change to a proper cloud storage service later
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.mimetype.split('/')[0] +
        '-' +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimetypes = /^(image|video|audio|text)\//;

    if (allowedMimetypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new FileNotSupportedError(), false);
    }
  },
});
