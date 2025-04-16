import {
  InsufficientPrivilegesError,
  InvalidRoleError,
  UnauthorizedError,
} from '../errors/user.errors.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

export const ROLES = {
  USER: 'USER',
  SYSADMIN: 'SYSADMIN',
};

const ROLES_HIERARCHY = {
  USER: 0,
  SYSADMIN: 1,
};

export const authorizeRolesMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      const { role } = req.user;

      console.log(role);

      if (!req.user) throw new UnauthorizedError();

      // ROLES[undefined] returns undefined. This happens when a role is not provided, or is anything besides USER or SYSADMIN
      if (!ROLES[role]) throw new InvalidRoleError();

      // If user has a role below the required role, deny access (this can be done by checking the hierarchy)
      // For example, undefined (role not provided or invalid) < USER < SYSADMIN
      if (ROLES_HIERARCHY[role] < ROLES_HIERARCHY[requiredRole])
        throw new InsufficientPrivilegesError();

      // User has the required role (SYSADMIN can bypass all roles)
      next();
    } catch (error) {
      if (error instanceof UnauthorizedError)
        return res
          .status(401)
          .json(
            new ErrorResponseBuilder()
              .setStatus(401)
              .setMessage('Unauthorized')
              .setError('User not authenticated')
              .build()
          );

      if (error instanceof InvalidRoleError)
        return res
          .status(403)
          .json(
            new ErrorResponseBuilder()
              .setStatus(403)
              .setMessage('Forbidden')
              .setError('Role invalid or not provided')
              .build()
          );

      if (error instanceof InsufficientPrivilegesError)
        return res
          .status(403)
          .json(
            new ErrorResponseBuilder()
              .setStatus(403)
              .setMessage('Forbidden')
              .setError(
                'User does not have sufficient privileges to perform this action'
              )
              .build()
          );

      res
        .status(500)
        .json(
          new ErrorResponseBuilder()
            .setStatus(500)
            .setMessage('Internal Server Error')
            .setError(error.message)
            .build()
        );
    }
  };
};
