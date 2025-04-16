import * as workspaceRepository from '../repositories/workspace.repository.js';
import * as userRepository from '../repositories/user.repository.js';
import {
  WorkspaceNotFoundError,
  WorkspaceAlreadyExistsError,
  InvalidMemberRoleError,
} from '../errors/workspace.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import { MEMBER_ROLES } from '../middlewares/check-member-role.middleware.js';

export const findAllWorkspaces = async (userId) => {
  return await workspaceRepository.findAllWorkspaces(userId);
};

export const findWorkspaceById = async (id, userId) => {
  const workspace = await workspaceRepository.findWorkspaceById(id, userId);

  if (!workspace) {
    throw new WorkspaceNotFoundError();
  }

  return workspace;
};

export const findWorkspaceByOwnerId = async (id, ownerId) => {
  const workspace = await workspaceRepository.findWorkspaceByOwnerId(
    id,
    ownerId
  );

  if (!workspace) {
    throw new WorkspaceNotFoundError();
  }

  return workspace;
};

export const findWorkspacesByOwnerId = async (ownerId) => {
  const userExists = await userRepository.findUserById(ownerId);

  if (!userExists) {
    throw new UserNotFoundError();
  }

  return await workspaceRepository.findWorkspacesByOwnerId(ownerId);
};

export const checkWorkspaceAvailability = async (title, userId) => {
  const workspace = await workspaceRepository.findWorkspaceByTitle(
    title,
    userId
  );

  return { available: Boolean(!workspace) };
};

export const createWorkspace = async ({ title, bookmarks, owner }) => {
  const workspaceExists = await workspaceRepository.findWorkspaceByTitle(title);

  if (workspaceExists) {
    throw new WorkspaceAlreadyExistsError();
  }

  return await workspaceRepository.createWorkspace({
    title,
    bookmarks,
    owner,
  });
};

// Members
export const findMemberRole = async (workspaceId, memberId) => {
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspace) throw new WorkspaceNotFoundError();

  const member = await workspaceRepository.findMember(workspaceId, memberId);

  if (!member) throw new UserNotFoundError();

  if (!MEMBER_ROLES[member.memberRole.toUpperCase()])
    throw new InvalidMemberRoleError();

  return member.memberRole;
};

export const inviteMember = async (
  workspaceId,
  ownerId,
  username,
  memberRole
) => {
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);
  const userExists = await userRepository.findUserByUsername(username);

  if (!workspace) {
    throw new WorkspaceNotFoundError();
  }

  if (!userExists) {
    throw new UserNotFoundError();
  }

  if (!MEMBER_ROLES[memberRole]) {
    throw new InvalidMemberRoleError();
  }

  const userId = userExists._id;

  return await workspaceRepository.inviteMember(
    workspaceId,
    ownerId,
    userId,
    memberRole
  );
};

export const updateMember = async (id, ownerId, username, role) => {
  const workspace = await workspaceRepository.findWorkspaceById(id, ownerId);
  const userExists = await userRepository.findUserByUsername(username);

  if (!workspace) {
    throw new WorkspaceNotFoundError();
  }

  if (!userExists) {
    throw new UserNotFoundError();
  }

  const userId = userExists._id;

  return await workspaceRepository.updateMember(id, ownerId, userId, role);
};

export const removeMember = async (id, ownerId, username) => {
  const workspace = await workspaceRepository.findWorkspaceById(id, ownerId);
  const userExists = await userRepository.findUserByUsername(username);

  if (!workspace) {
    throw new WorkspaceNotFoundError();
  }

  if (!userExists) {
    throw new UserNotFoundError();
  }

  const userId = userExists._id;

  return await workspaceRepository.removeMember(id, ownerId, userId);
};

export const updateWorkspace = async (id, userId, { title, bookmarks }) => {
  const workspaceExists = await workspaceRepository.findWorkspaceById(
    id,
    userId
  );

  if (!workspaceExists) {
    throw new WorkspaceNotFoundError();
  }

  return await workspaceRepository.updateWorkspace(id, {
    title,
    bookmarks,
    owner: userId,
  });
};

export const deleteWorkspace = async (id, userId) => {
  const workspaceExists = await workspaceRepository.findWorkspaceById(
    id,
    userId
  );

  if (!workspaceExists) {
    throw new WorkspaceNotFoundError();
  }

  return await workspaceRepository.deleteWorkspace(id, userId);
};
