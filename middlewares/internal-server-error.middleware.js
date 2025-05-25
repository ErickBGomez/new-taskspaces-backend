import ErrorResponseBuilder from '../helpers/error-response-builder';

export const handleInternalServerError = (err, req, res, next) => {
  res
    .status(500)
    .json(
      new ErrorResponseBuilder()
        .setStatus(500)
        .setMessage('Internal server error')
        .setError(err.message)
        .build()
    );

  next(err);
};
