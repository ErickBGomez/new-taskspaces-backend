import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json(
        new ErrorResponseBuilder()
          .setStatus(401)
          .setMessage('Unauthorized')
          .setError('Token not provided')
          .build()
      );
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(
        new ErrorResponseBuilder()
          .setStatus(401)
          .setMessage('Unauthorized')
          .setError(`Invalid token: ${error.message}`)
          .build()
      );
  }
};

export default authMiddleware;
