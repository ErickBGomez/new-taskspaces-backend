import * as projectService from '../services/project.service.js';
import {
  ProjectNotFoundError,
  ProjectAlreadyExists,
} from '../errors/project.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.findAllProjects();

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Projects found')
          .setContent(projects)
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

export const getProjectsByWorkspaceId = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const projects =
      await projectService.findProjectsByWorkspaceId(workspaceId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Projects found')
          .setContent(projects)
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

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await projectService.findProjectById(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Project found')
          .setContent(project)
          .build()
      );
  } catch (error) {
    if (error instanceof ProjectNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Project not found')
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

export const createProject = async (req, res) => {
  try {
    // In the case of create project, it's necessary to retrieve the workspaceId
    // because its part of the project schema to have the reference to the workspace
    const { workspaceId } = req.params;

    const { title, icon } = req.body;

    const project = await projectService.createProject(workspaceId, {
      title,
      icon,
    });

    res
      .status(201)
      .json(
        new SuccessResponseBuilder()
          .setStatus(201)
          .setMessage('Project created')
          .setContent(project)
          .build()
      );
  } catch (error) {
    if (error instanceof ProjectAlreadyExists)
      return res
        .status(409)
        .json(
          new ErrorResponseBuilder()
            .setStatus(409)
            .setMessage('Project already exists')
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

export const updateProject = async (req, res) => {
  try {
    // In the case of update project, it's not necessary to retrieve the workspaceId
    // because workspaceId cannot be updated, and the member role has been checked before
    // in checkMemberRoleMiddleware
    const { id } = req.params;
    const { title, statuses, tags, icon } = req.body;

    const updatedProject = await projectService.updateProject(id, {
      title,
      statuses,
      tags,
      icon,
    });

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Project updated')
          .setContent(updatedProject)
          .build()
      );
  } catch (error) {
    if (error instanceof ProjectNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Project not found')
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

export const deleteProject = async (req, res) => {
  try {
    // In the case of delete project, it's the same case as update project
    // the workspaceId is not necessary to retrieve
    const { id } = req.params;

    await projectService.deleteProject(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Project deleted')
          .build()
      );
  } catch (error) {
    if (error instanceof ProjectNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Project not found')
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
