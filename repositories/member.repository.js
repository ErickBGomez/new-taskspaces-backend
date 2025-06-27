import { parseMemberRoleData } from '../helpers/member.helper.js';
import prisma from '../utils/prisma.js';

const selectMemberRole = {
  member_role: {
    select: {
      value: true,
    },
  },
};

export const getMemberRoleByWorkspaceId = async (workspaceId, userId) => {
  const role = await prisma.workspace_member.findFirst({
    where: {
      workspace_id: parseInt(workspaceId),
      user_id: parseInt(userId),
    },
    select: {
      ...selectMemberRole,
    },
  });

  return parseMemberRoleData(role);
};

export const getMemberRoleByProjectId = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: parseInt(projectId),
    },
    select: {
      workspace: {
        select: {
          id: true,
        },
      },
    },
  });

  const role = await prisma.workspace_member.findFirst({
    where: {
      workspace_id: parseInt(project.workspace.id),
      user_id: parseInt(userId),
    },
    select: {
      ...selectMemberRole,
    },
  });

  return parseMemberRoleData(role);
};

export const getMemberRoleByTaskId = async (taskId, userId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(taskId),
    },
    select: {
      project: {
        select: {
          workspace: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const role = await prisma.workspace_member.findFirst({
    where: {
      workspace_id: parseInt(task.project.workspace.id),
      user_id: parseInt(userId),
    },
    select: {
      ...selectMemberRole,
    },
  });

  return parseMemberRoleData(role);
};
