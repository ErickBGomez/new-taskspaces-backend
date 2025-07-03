import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { findMemberRole } from '../services/workspace.service.js';
import { findWorkspaceIdFromProject } from '../helpers/project.helper.js';
import { findWorkspaceIdFromTask } from '../helpers/task.helper.js';
import {
  InsufficientPrivilegesError,
  UnauthorizedError,
  UserNotFoundError,
} from '../errors/user.errors.js';
import {
  InvalidMemberRoleError,
  WorkspaceNotFoundError,
} from '../errors/workspace.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { InvalidDepthError } from '../errors/common.errors.js';
import { ROLES } from './authorize-roles.middleware.js';
import { findWorkspaceIdFromTag } from '../helpers/tag.helper.js';
import { findWorkspaceIdFromComment } from '../helpers/comment.helper.js';
import { validateMemberRole } from '../helpers/member.helper.js';

export const MEMBER_ROLES = {
  READER: 'READER',
  COLLABORATOR: 'COLLABORATOR',
  ADMIN: 'ADMIN',
};

export const MEMBER_ROLES_HIERARCHY = {
  READER: 0,
  COLLABORATOR: 1,
  ADMIN: 2,
};

export const DEPTH = {
  WORKSPACE: 'workspace',
  PROJECT: 'project',
  TASK: 'task',
  TAG: 'tag',
  COMMENT: 'comment',
};

export const checkMemberRoleMiddleware = (requiredMemberRole, depth) => {
  return async (req, res, next) => {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { id: userId, role } = req.user;

      // Check if user is SYSADMIN (SYSADMIN does not have to be
      // checked by their member roles)
      if (ROLES[role] === ROLES.SYSADMIN) return next();

      const validate = await validateMemberRole(
        requiredMemberRole,
        depth,
        req.params,
        userId
      );

      // User has the required member role (ADMIN can bypass all member roles)
      if (validate) next();
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

      if (
        error instanceof WorkspaceNotFoundError ||
        error instanceof ProjectNotFoundError ||
        error instanceof TaskNotFoundError ||
        error instanceof UserNotFoundError
      )
        return res
          .status(404)
          .json(
            new ErrorResponseBuilder()
              .setStatus(404)
              .setMessage('Not Found')
              .setError(error.message)
              .build()
          );

      if (error instanceof InvalidDepthError)
        return res
          .status(400)
          .json(
            new ErrorResponseBuilder()
              .setStatus(400)
              .setMessage('Bad Request')
              .setError('Invalid depth provided')
              .build()
          );

      if (error instanceof InvalidMemberRoleError)
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
