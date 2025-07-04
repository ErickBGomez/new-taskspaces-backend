import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import * as mediaService from '../services/media.service.js';

export const uploadMediaToTask = async (req, res, next) => {
  const { id: authorId } = req.user;
  const { taskId } = req.params;

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
    const file = req.file.filename;
    // Get URL based on current protocol and host
    const url = `${req.protocol}://${req.get('host')}/media/${file}`;

    // Save file in database
    const mediaUploaded = await mediaService.uploadMediaToTask(
      {
        filename: file,
        type: req.file.mimetype,
        url: url,
      },
      authorId,
      taskId
    );

    res.status(201).json(
      new SuccessResponseBuilder()
        .setStatus(201)
        .setMessage('File uploaded successfully')
        // TODO: Set content here
        .setContent({ ...mediaUploaded })
    );
  } catch (error) {
    next(error);
  }
};

export const uploadMedia = async (req, res, next) => {
  const { id: authorId } = req.user;

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
    const file = req.file.filename;
    // Get URL based on current protocol and host
    const url = `${req.protocol}://${req.get('host')}/media/${file}`;

    // Save file in database
    const mediaUploaded = await mediaService.uploadMedia(
      {
        filename: file,
        type: req.file.mimetype,
        url: url,
      },
      authorId
    );

    res.status(201).json(
      new SuccessResponseBuilder()
        .setStatus(201)
        .setMessage('File uploaded successfully')
        // TODO: Set content here
        .setContent({ ...mediaUploaded })
    );
  } catch (error) {
    next(error);
  }
};
