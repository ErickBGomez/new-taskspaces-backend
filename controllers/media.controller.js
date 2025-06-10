import config from '../config/config.js';
import s3 from '../helpers/aws.helper.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { generateFileName } from '../helpers/media.helper.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';

const { BUCKET_NAME } = config;

export const uploadMedia = async (req, res, next) => {
  try {
    console.log(req.file);

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

    const fileName = generateFileName(req.file.originalname);

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read', // Make image publicly accessible
      Metadata: {
        'original-name': req.file.originalname,
        'upload-date': new Date().toISOString(),
      },
    };

    const result = await s3.upload(uploadParams).promise();

    res.status(201).json(
      new SuccessResponseBuilder()
        .setStatus(201)
        .setMessage('File uploaded successfully')
        .setContent({
          key: fileName,
          url: result.Location,
          bucket: BUCKET_NAME,
          size: req.file.size,
          mimetype: req.file.mimetype,
        })
    );
  } catch (error) {
    next(error);
  }
};
