import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { upload } from '../helpers/multer.helper.js';

const uploadImageMiddleware = (req, res, next) => {
  const uploadImage = upload.single('media');

  uploadImage(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setError('UploadError')
            .setMessage(err.message)
            .build()
        );
    }

    next();
  });
};

export default uploadImageMiddleware;
