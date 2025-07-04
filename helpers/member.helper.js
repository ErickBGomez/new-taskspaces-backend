import { InvalidDepthError } from '../errors/common.errors.js';
import { InsufficientPrivilegesError } from '../errors/user.errors.js';
import { InvalidMemberRoleError } from '../errors/workspace.errors.js';
import {
  DEPTH,
  MEMBER_ROLES,
  MEMBER_ROLES_HIERARCHY,
} from '../middlewares/check-member-role.middleware.js';
import { findMemberRole } from '../services/workspace.service.js';
import { findWorkspaceIdFromComment } from './comment.helper.js';
import { findWorkspaceIdFromProject } from './project.helper.js';
import { findWorkspaceIdFromTag } from './tag.helper.js';
import { findWorkspaceIdFromTask } from './task.helper.js';

export const parseMemberRoleData = (data) => {
  if (!data) return null;

  return {
    role: data.member_role.value,
  };
};

export const validateMemberRole = async (
  requiredMemberRole,
  depth,
  params,
  userId
) => {
  let workspaceId;

  switch (depth) {
    case DEPTH.WORKSPACE: {
      // Obtain either workspaceId or id from path parameters
      const { workspaceId: workspaceIdParams, id } = params;
      const resolvedWorkspaceId = workspaceIdParams ?? id;

      workspaceId = resolvedWorkspaceId;

      break;
    }
    case DEPTH.PROJECT: {
      const { projectId, id } = params;
      const resolvedProjectId = projectId ?? id;

      workspaceId = await findWorkspaceIdFromProject(resolvedProjectId);

      break;
    }
    case DEPTH.TASK: {
      const { taskId, id } = params;
      const resolvedTaskId = taskId ?? id;

      workspaceId = await findWorkspaceIdFromTask(resolvedTaskId);

      break;
    }
    case DEPTH.TAG: {
      const { tagId, id } = params;
      const resolvedTagId = tagId ?? id;

      workspaceId = await findWorkspaceIdFromTag(resolvedTagId);

      break;
    }

    case DEPTH.COMMENT: {
      const { commentId, id } = params;
      const resolvedCommentId = commentId ?? id;

      workspaceId = await findWorkspaceIdFromComment(resolvedCommentId);
      break;
    }

    default:
      throw new InvalidDepthError();
  }

  const memberRole = await findMemberRole(workspaceId, userId);

  if (!MEMBER_ROLES[memberRole]) throw new InvalidMemberRoleError();

  if (
    MEMBER_ROLES_HIERARCHY[memberRole] <
    MEMBER_ROLES_HIERARCHY[requiredMemberRole]
  )
    throw new InsufficientPrivilegesError();

  // True if the user has the required member role
  return true;
};
