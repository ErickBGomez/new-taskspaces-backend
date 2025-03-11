import * as projectService from '../services/project.service.js';
import {
  ProjectNotFoundError,
  ProjectAlreadyExists,
} from '../errors/project.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

export const getAllProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const projects = await projectService.findAllProjects(workspaceId);

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
    const { id, workspaceId } = req.params;

    const project = await projectService.findProjectById(id, workspaceId);

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
    const { workspaceId } = req.params;

    const { title, statuses, tags, icon } = req.body;

    const project = await projectService.createProject(workspaceId, {
      title,
      statuses,
      tags,
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
    const { id, workspaceId } = req.params;
    const { title, statuses, tags, icon } = req.body;

    const updatedProject = await projectService.updateProject(id, workspaceId, {
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
    const { id, workspaceId } = req.params;

    await projectService.deleteProject(id, workspaceId);

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
