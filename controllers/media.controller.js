import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('No file uploaded')
            .build()
        );
    }

    // Get uploaded file name
    const filename = req.file.filename;

    res.status(201).json(
      new SuccessResponseBuilder()
        .setStatus(201)
        .setMessage('File uploaded successfully')
        // TODO: Set content here
        .setContent({
          file: filename,
          // Get URL based on current protocol and host
          url: `${req.protocol}://${req.get('host')}/media/${filename}`,
        })
    );
  } catch (error) {
    next(error);
  }
};
