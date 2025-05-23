import * as workspaceService from '../services/workspace.service.js';
import {
  WorkspaceNotFoundError,
  WorkspaceAlreadyExistsError,
  InvalidMemberRoleError,
  UserAlreadyInvitedError,
  MemberRoleSelfModifiedError,
  MemberSelfRemovedError,
} from '../errors/workspace.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import { ROLES } from '../middlewares/authorize-roles.middleware.js';

export const getAllWorkspaces = async (req, res) => {
  try {
    const workspaces = await workspaceService.findAllWorkspaces();

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Workspaces found')
          .setContent(workspaces)
          .build()
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const getWorkspaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await workspaceService.findWorkspaceById(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Workspace found')
          .setContent(workspace)
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const getWorkspacesByOwnerId = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { ownerId } = req.params;

    // This controller cannot be checked by the middleware checkMemberRoleMiddleware,
    // because there is no way to obtain the id of a specific workspace

    // Avoid obtaining workspaces from other users, only sysadmin can do that
    if (role !== ROLES.SYSADMIN && userId !== ownerId)
      throw new UserNotFoundError();

    const workspaces = await workspaceService.findWorkspacesByOwnerId(ownerId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Workspaces found')
          .setContent(workspaces)
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const checkWorkspaceAvailability = async (req, res) => {
  try {
    const { title } = req.query;
    const { id: userId } = req.user;

    const { available } = await workspaceService.checkWorkspaceAvailability(
      title,
      userId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Workspace availability checked')
          .setContent({ available })
          .build()
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const createWorkspace = async (req, res) => {
  try {
    const { title } = req.body;
    const { id: userId, username } = req.user;

    const workspace = await workspaceService.createWorkspace({
      title,
      ownerId: userId,
    });

    const updatedWorkspace = await workspaceService.inviteMember(
      workspace.id,
      username,
      'ADMIN'
    );

    res
      .status(201)
      .json(
        new SuccessResponseBuilder()
          .setStatus(201)
          .setMessage('Workspace created')
          .setContent(updatedWorkspace)
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceAlreadyExistsError)
      return res
        .status(409)
        .json(
          new ErrorResponseBuilder()
            .setStatus(409)
            .setMessage('Workspace already exists')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const workspace = await workspaceService.updateWorkspace(id, { title });

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Workspace updated')
          .setContent(workspace)
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    await workspaceService.deleteWorkspace(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Workspace deleted')
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

// Members
export const getMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await workspaceService.findMembers(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Members found')
          .setContent(members)
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const getMemberRole = async (req, res) => {
  try {
    const { id: workspaceId, memberId } = req.params;

    const memberRole = await workspaceService.findMemberRole(
      workspaceId,
      memberId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member role found')
          .setContent({ memberRole })
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof InvalidMemberRoleError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid member role')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, memberRole } = req.body;

    // TODO: Invite by email
    const workspace = await workspaceService.inviteMember(
      id,
      username,
      memberRole
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member assigned')
          .setContent(workspace)
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof InvalidMemberRoleError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid member role')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserAlreadyInvitedError)
      return res
        .status(409)
        .json(
          new ErrorResponseBuilder()
            .setStatus(409)
            .setMessage('User already invited')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { id: actionUserId } = req.user;
    const { memberRole } = req.body;

    const workspace = await workspaceService.updateMember(
      id,
      actionUserId,
      memberId,
      memberRole
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member updated')
          .setContent(workspace)
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof MemberRoleSelfModifiedError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Member role cannot be modified by self')
            .setError(error.message)
            .build()
        );

    if (error instanceof InvalidMemberRoleError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Invalid member role')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { id: actionUserId } = req.user;

    const workspace = await workspaceService.removeMember(
      id,
      actionUserId,
      memberId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Member removed')
          .setContent(workspace)
          .build()
      );
  } catch (error) {
    if (error instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    if (error instanceof MemberSelfRemovedError)
      return res
        .status(400)
        .json(
          new ErrorResponseBuilder()
            .setStatus(400)
            .setMessage('Member cannot be removed by self')
            .setError(error.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};
