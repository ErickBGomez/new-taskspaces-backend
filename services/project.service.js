import * as projectRepository from '../repositories/project.repository.js';
import {
  ProjectNotFoundError,
  ProjectAlreadyExists,
} from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';

export const findAllProjects = async () => {
  return await projectRepository.findAllProjects();
};

export const findProjectsByWorkspaceId = async (workspaceId) => {
  return await projectRepository.findProjectsByWorkspaceId(workspaceId);
};

export const findProjectById = async (id) => {
  const project = await projectRepository.findProjectById(id);

  if (!project) {
    throw new ProjectNotFoundError();
  }

  return project;
};

export const createProject = async (workspaceId, { title, icon }) => {
  const projectExists = await projectRepository.findProjectByTitle(
    title,
    workspaceId
  );

  if (projectExists) {
    throw new ProjectAlreadyExists();
  }

  return await projectRepository.createProject({
    title,
    icon,
    workspace: workspaceId,
  });
};

export const updateProject = async (id, { title, statuses, tags, icon }) => {
  const projectExists = await projectRepository.findProjectById(id);

  if (!projectExists) {
    throw new ProjectNotFoundError();
  }

  return await projectRepository.updateProject(id, {
    title,
    statuses,
    tags,
    icon,
  });
};

export const deleteProject = async (id) => {
  const projectExists = await projectRepository.findProjectById(id);

  if (!projectExists) {
    throw new ProjectNotFoundError();
  }

  return await projectRepository.deleteProject(id);
};

// Methods without routes
export const findWorkspaceIdByProjectId = async (projectId) => {
  const project = await projectRepository.findProjectById(projectId);

  if (!project) throw new ProjectNotFoundError();

  if (!project.workspace) throw new WorkspaceNotFoundError();

  return project.workspace;
};
