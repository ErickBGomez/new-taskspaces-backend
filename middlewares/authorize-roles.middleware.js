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
    const { role } = req.user;

    if (!req.user)
      return res
        .status(401)
        .json(
          new ErrorResponseBuilder.setStatus(401)
            .setMessage('Unauthorized')
            .setError('User not authenticated')
            .build()
        );

    // ROLES[undefined] returns undefined. This happens when a role is not provided, or is anything besides USER or SYSADMIN
    if (!ROLES[role])
      return res
        .status(403)
        .json(
          new ErrorResponseBuilder.setStatus(403)
            .setMessage('Forbidden')
            .setError('Role invalid or not provided')
            .build()
        );

    // If user has a role below the required role, deny access (this can be done by checking the hierarchy)
    // For example, undefined (role not provided or invalid) < USER < SYSADMIN
    if (ROLES_HIERARCHY[role] < ROLES_HIERARCHY[requiredRole])
      return res
        .status(403)
        .json(
          new ErrorResponseBuilder.setStatus(403)
            .setMessage('Forbidden')
            .setError(
              'User does not have sufficient privileges to perform this action'
            )
            .build()
        );

    // User has the required role (SYSADMIN can bypass all roles)
    next();
  };
};
