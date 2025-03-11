import * as workspaceService from '../services/workspace.service.js';
import {
  WorkspaceNotFoundError,
  WorkspaceAlreadyExistsError,
} from '../errors/workspace.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { UserNotFoundError } from '../errors/user.errors.js';

export const getAllWorkspaces = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const workspaces = await workspaceService.findAllWorkspaces(userId);

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
    const { id: userId } = req.user;

    const workspace = await workspaceService.findWorkspaceById(id, userId);

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
    const { ownerId } = req.params;

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

export const getWorkspaceByOwnerId = async (req, res) => {
  try {
    const { id: workspaceId, userId } = req.params;

    const workspace = await workspaceService.findWorkspaceByOwnerId(
      workspaceId,
      userId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Workspace found')
          .setContent(workspace)
          .build()
      );
  } catch (e) {
    if (e instanceof WorkspaceNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Workspace not found')
            .setError(e.message)
            .build()
        );

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(e.message)
          .build()
      );
  }
};

export const createWorkspace = async (req, res) => {
  try {
    const { title, bookmarks } = req.body;
    const { id: userId, username } = req.user;

    const workspace = await workspaceService.createWorkspace({
      title,
      bookmarks,
      owner: userId,
    });

    const updatedWorkspace = await workspaceService.inviteMember(
      workspace._id,
      userId,
      username,
      'admin'
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

export const inviteMember = async (req, res) => {
  try {
    const { id, username } = req.params;
    const { role } = req.body;
    const { id: ownerId } = req.user;

    const workspace = await workspaceService.inviteMember(
      id,
      ownerId,
      username,
      role
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
    const { id, username } = req.params;
    const { id: ownerId } = req.user;

    const workspace = await workspaceService.removeMember(
      id,
      ownerId,
      username
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
    const { title, bookmarks, members } = req.body;
    const { id: userId } = req.user;

    const workspace = await workspaceService.updateWorkspace(id, userId, {
      title,
      bookmarks,
      members,
    });

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
    const { id: userId } = req.user;

    await workspaceService.deleteWorkspace(id, userId);

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
