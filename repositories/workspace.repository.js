import {
  parseWorkspaceData,
  parseWorkspaceMember,
} from '../helpers/workspace.helper.js';
import prisma from '../utils/prisma.js';
import { MEMBER_ROLE_STRING_TO_INT } from '../utils/workspace.utils.js';

export const selectWorkspace = {
  id: true,
  title: true,
  created_at: true,
  updated_at: true,
};

const selectWorkspaceMember = {
  user_app: {
    select: {
      id: true,
      fullname: true,
      username: true,
      avatar: true,
      email: true,
    },
  },
  member_role: {
    select: {
      value: true,
    },
  },
};

export const findAllWorkspaces = async () => {
  const workspaces = await prisma.workspace.findMany({
    select: { ...selectWorkspace },
  });

  return workspaces.map((workspace) => parseWorkspaceData(workspace));
};

export const findWorkspaceById = async (id) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: parseInt(id),
    },
    select: { ...selectWorkspace },
  });

  return parseWorkspaceData(workspace);
};

export const findWorkspaceByTitleAndOwnerId = async (title, userId) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      title,
      owner_id: parseInt(userId),
    },
    select: { ...selectWorkspace },
  });

  return parseWorkspaceData(workspace);
};

export const findWorkspacesByOwnerId = async (ownerId) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      owner_id: parseInt(ownerId),
    },
    select: { ...selectWorkspace },
  });

  return workspaces.map((workspace) => parseWorkspaceData(workspace));
};

export const findSharedWorkspacesByUserId = async (userId) => {
  const workspaces = await prisma.workspace_member.findMany({
    where: {
      user_id: parseInt(userId),
    },
    select: {
      workspace: {
        select: { ...selectWorkspace, owner_id: true },
      },
    },
  });

  // Filter workspaces by only shared ones
  // Do not include workspaces owned by the user
  const sharedWorkspaces = workspaces.filter(
    (workspace) => workspace.workspace.owner_id !== parseInt(userId)
  );

  return sharedWorkspaces.map((workspace) =>
    parseWorkspaceData(workspace.workspace)
  );
};

export const createWorkspace = async (workspace, ownerId) => {
  const createdWorkspace = await prisma.workspace.create({
    data: {
      ...workspace,
      owner_id: parseInt(ownerId),
    },
    select: { ...selectWorkspace },
  });

  return parseWorkspaceData(createdWorkspace);
};

export const updateWorkspace = async (id, workspace) => {
  const updatedWorkspace = await prisma.workspace.update({
    where: {
      id: parseInt(id),
    },
    data: { ...workspace },
    select: { ...selectWorkspace },
  });

  return parseWorkspaceData(updatedWorkspace);
};

export const deleteWorkspace = async (id) => {
  const deletedWorkspace = await prisma.workspace.delete({
    where: {
      id: parseInt(id),
    },
    select: { ...selectWorkspace },
  });

  return parseWorkspaceData(deletedWorkspace);
};

// Members
export const findMembers = async (workspaceId) => {
  const members = await prisma.workspace_member.findMany({
    where: {
      workspace_id: parseInt(workspaceId),
    },
    select: { ...selectWorkspaceMember },
  });

  return members.map((member) => parseWorkspaceMember(member));
};

export const findMember = async (workspaceId, memberId) => {
  const member = await prisma.workspace_member.findFirst({
    where: {
      workspace_id: parseInt(workspaceId),
      user_id: parseInt(memberId),
    },
    select: { ...selectWorkspaceMember },
  });

  return parseWorkspaceMember(member);
};

export const inviteMember = async (workspaceId, memberId, memberRole) => {
  const invitedMember = await prisma.workspace_member.create({
    data: {
      workspace_id: parseInt(workspaceId),
      user_id: parseInt(memberId),
      member_role_id: MEMBER_ROLE_STRING_TO_INT[memberRole] || 1, // Default to READER if role is not recognized
    },
    select: { ...selectWorkspaceMember },
  });

  return parseWorkspaceMember(invitedMember);
};

export const updateMember = async (workspaceId, memberId, memberRole) => {
  const updatedMember = await prisma.workspace_member.update({
    where: {
      workspace_id_user_id: {
        workspace_id: parseInt(workspaceId),
        user_id: parseInt(memberId),
      },
    },
    data: {
      member_role_id: MEMBER_ROLE_STRING_TO_INT[memberRole] || 1, // Default to READER if role is not recognized
    },
    select: { ...selectWorkspaceMember },
  });

  return parseWorkspaceMember(updatedMember);
};

export const removeMember = async (workspaceId, memberId) => {
  const removedMember = await prisma.workspace_member.delete({
    where: {
      workspace_id_user_id: {
        workspace_id: parseInt(workspaceId),
        user_id: parseInt(memberId),
      },
    },
    select: { ...selectWorkspaceMember },
  });

  return parseWorkspaceMember(removedMember);
};
