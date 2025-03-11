import { validationResult } from 'express-validator';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      const existingField = acc.find((field) => field.field === error.path);
      if (existingField) {
        existingField.errors.push(error.msg);
      } else {
        acc.push({ field: error.path, errors: [error.msg] });
      }
      return acc;
    }, []);

    return res
      .status(400)
      .json(
        new ErrorResponseBuilder()
          .setStatus(400)
          .setMessage('Bad Request')
          .setError(formattedErrors)
          .build()
      );
  }
  next();
};

export default checkValidation;
