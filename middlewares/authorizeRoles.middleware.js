export const ROLES = {
  USER: 'USER',
  SYSADMIN: 'SYSADMIN',
};

const ROLES_HIERARCHY = {
  USER: 0,
  SYSADMIN: 1,
};

export const authorizeRoles = (requiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!req.user)
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized',
        error: 'User not authenticated',
      });

    // ROLES[undefined] returns undefined. This happens when a role is not provided, or is anything besides USER or SYSADMIN
    if (!ROLES[role])
      return res.status(403).json({
        status: 403,
        message: 'Forbidden',
        error: 'Role invalid or not provided',
      });

    // If user has a role below the required role, deny access (this can be done by checking the hierarchy)
    // For example, undefined (role not provided or invalid) < USER < SYSADMIN
    if (ROLES_HIERARCHY[role] < ROLES_HIERARCHY[requiredRole])
      return res.status(403).json({
        status: 403,
        message: 'Forbidden',
        error:
          'User does not have sufficient privileges to perform this action',
      });

    // User has the required role (SYSADMIN can bypass all roles)
    next();
  };
};
