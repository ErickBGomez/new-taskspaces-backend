import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import * as workspaceService from '../services/workspace.service.js';
import * as projectHelper from '../helpers/project.helper.js';
import * as taskHelper from '../helpers/task.helper.js';
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

export const MEMBER_ROLES = {
  READER: 'READER',
  COLLABORATOR: 'COLLABORATOR',
  ADMIN: 'ADMIN',
};

const MEMBER_ROLES_HIERARCHY = {
  READER: 0,
  COLLABORATOR: 1,
  ADMIN: 2,
};

export const DEPTH = {
  TASK: 'task',
  PROJECT: 'project',
  WORKSPACE: 'workspace',
};

export const checkMemberRoleMiddleware = (requiredMemberRole, depth) => {
  return async (req, res, next) => {
    try {
      if (!req.user) throw new UnauthorizedError();

      const { id: userId, role } = req.user;

      // Check if user is SYSADMIN (SYSADMIN does not have to be
      // checked by their member roles)
      if (ROLES[role] === ROLES.SYSADMIN) return next();

      let memberRole;

      // TODO: Refactor these lines
      switch (depth) {
        case DEPTH.WORKSPACE: {
          // Obtain either workspaceId or id from path parameters
          const { workspaceId, id } = req.params;
          const resolvedWorkspaceId = workspaceId ?? id;

          memberRole = await workspaceService.findMemberRole(
            resolvedWorkspaceId,
            userId
          );
          break;
        }
        case DEPTH.PROJECT: {
          const { projectId, id } = req.params;
          const resolvedProjectId = projectId ?? id;

          const workspaceId =
            await projectHelper.findWorkspaceIdByProjectId(resolvedProjectId);

          memberRole = await workspaceService.findMemberRole(
            workspaceId,
            userId
          );

          break;
        }
        case DEPTH.TASK: {
          const { taskId, id } = req.params;
          const resolvedTaskId = taskId ?? id;

          const projectId =
            await taskHelper.findProjectIdByTaskId(resolvedTaskId);

          const workspaceId =
            await projectHelper.findWorkspaceIdByProjectId(projectId);

          memberRole = await workspaceService.findMemberRole(
            workspaceId,
            userId
          );

          break;
        }
        default:
          throw new InvalidDepthError();
      }

      if (!MEMBER_ROLES[memberRole]) throw new InvalidMemberRoleError();

      if (
        MEMBER_ROLES_HIERARCHY[memberRole] <
        MEMBER_ROLES_HIERARCHY[requiredMemberRole]
      )
        throw new InsufficientPrivilegesError();

      // User has the required member role (ADMIN can bypass all member roles)
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
