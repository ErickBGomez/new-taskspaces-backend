import * as workspaceRepository from '../repositories/workspace.repository.js';
import * as userRepository from '../repositories/user.repository.js';
import {
  WorkspaceNotFoundError,
  WorkspaceAlreadyExistsError,
  InvalidMemberRoleError,
  UserAlreadyInvitedError,
  MemberRoleSelfModifiedError,
  MemberSelfRemovedError,
} from '../errors/workspace.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import { MEMBER_ROLES } from '../middlewares/check-member-role.middleware.js';

export const findAllWorkspaces = async () => {
  return await workspaceRepository.findAllWorkspaces();
};

export const findWorkspaceById = async (id) => {
  const workspace = await workspaceRepository.findWorkspaceById(id);

  if (!workspace) throw new WorkspaceNotFoundError();

  return workspace;
};

export const findWorkspacesByOwnerId = async (ownerId) => {
  const userExists = await userRepository.findUserById(ownerId);

  if (!userExists) throw new UserNotFoundError();

  return await workspaceRepository.findWorkspacesByOwnerId(ownerId);
};

export const checkWorkspaceAvailability = async (title, userId) => {
  const workspace = await workspaceRepository.findWorkspaceByTitleAndOwnerId(
    title,
    userId
  );

  return { available: Boolean(!workspace) };
};

export const findSharedWorkspacesByUserId = async (userId) => {
  const userExists = await userRepository.findUserById(userId);

  if (!userExists) throw new UserNotFoundError();

  return await workspaceRepository.findSharedWorkspacesByUserId(userId);
};

export const createWorkspace = async ({ title }, ownerId) => {
  const workspaceExists =
    await workspaceRepository.findWorkspaceByTitleAndOwnerId(title, ownerId);

  if (workspaceExists) throw new WorkspaceAlreadyExistsError();

  return await workspaceRepository.createWorkspace({ title }, ownerId);
};

export const updateWorkspace = async (id, { title }) => {
  const workspaceExists = await workspaceRepository.findWorkspaceById(id);

  if (!workspaceExists) throw new WorkspaceNotFoundError();

  return await workspaceRepository.updateWorkspace(id, { title });
};

export const deleteWorkspace = async (id) => {
  const workspaceExists = await workspaceRepository.findWorkspaceById(id);

  if (!workspaceExists) throw new WorkspaceNotFoundError();

  return await workspaceRepository.deleteWorkspace(id);
};

// Members
export const findMembers = async (workspaceId, requestUserId) => {
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspace) throw new WorkspaceNotFoundError();

  return await workspaceRepository.findMembers(workspaceId, requestUserId);
};

export const findMemberRole = async (workspaceId, memberId) => {
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspace) throw new WorkspaceNotFoundError();

  const member = await workspaceRepository.findMember(workspaceId, memberId);

  if (!member) throw new UserNotFoundError();

  if (!MEMBER_ROLES[member.memberRole?.toUpperCase()])
    throw new InvalidMemberRoleError();

  return member.memberRole;
};

export const inviteMember = async (
  workspaceId,
  username,
  memberRole,
  requestUserId
) => {
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspace) throw new WorkspaceNotFoundError();

  const userExists = await userRepository.findUserByUsername(username);

  if (!userExists) throw new UserNotFoundError();

  // Check if memberRole is a valid role
  if (!MEMBER_ROLES[memberRole]) throw new InvalidMemberRoleError();

  // Check if the user is already a member of the workspace
  const existingMembers = await workspaceRepository.findMembers(
    workspaceId,
    requestUserId
  );
  if (existingMembers?.some((member) => member.user.username === username))
    throw new UserAlreadyInvitedError();

  // Else, invite the user
  const memberId = userExists.id;

  return await workspaceRepository.inviteMember(
    workspaceId,
    memberId,
    memberRole
  );
};

export const updateMember = async (id, memberId, memberRole, requestUserId) => {
  const workspace = await workspaceRepository.findWorkspaceById(id);

  if (!workspace) throw new WorkspaceNotFoundError();

  // Check if actions user and member exists
  const actionUserExists = await userRepository.findUserById(requestUserId);
  if (!actionUserExists) throw new UserNotFoundError();

  const memberExists = await userRepository.findUserById(memberId);
  if (!memberExists) throw new UserNotFoundError();

  // Avoid the user to update their own member role
  if (requestUserId === memberId) throw new MemberRoleSelfModifiedError();

  if (!MEMBER_ROLES[memberRole]) throw new InvalidMemberRoleError();

  // Check if the user is NOT a member of the workspace
  const existingMembers = await workspaceRepository.findMembers(
    id,
    requestUserId
  );
  if (
    !existingMembers?.some((member) => member.user.id.toString() === memberId)
  )
    throw new UserNotFoundError();

  return await workspaceRepository.updateMember(id, memberId, memberRole);
};

// TODO: Define a way to assign a new owner to the workspace when the current owner is removed
export const removeMember = async (id, memberId, requestUserId) => {
  const workspace = await workspaceRepository.findWorkspaceById(id);

  if (!workspace) throw new WorkspaceNotFoundError();

  const actionUserExists = await userRepository.findUserById(requestUserId);
  if (!actionUserExists) throw new UserNotFoundError();

  const memberExists = await userRepository.findUserById(memberId);
  if (!memberExists) throw new UserNotFoundError();

  // Avoid the user to update their own member role
  if (requestUserId === memberId) throw new MemberSelfRemovedError();

  // Check if the user is NOT a member of the workspace
  const existingMembers = await workspaceRepository.findMembers(
    id,
    requestUserId
  );
  if (
    !existingMembers?.some((member) => member.user.id.toString() === memberId)
  )
    throw new UserNotFoundError();

  return await workspaceRepository.removeMember(id, memberId);
};
