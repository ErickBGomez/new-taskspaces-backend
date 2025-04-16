import * as projectRepository from '../repositories/project.repository.js';
import {
  ProjectNotFoundError,
  ProjectAlreadyExists,
} from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';

export const findAllProjects = async (workspaceId) => {
  return await projectRepository.findAllProjects(workspaceId);
};

export const findGlobalProjects = async () => {
  return await projectRepository.findGlobalProjects();
};

export const findProjectById = async (id, workspaceId) => {
  const project = await projectRepository.findProjectByIdAndWorkspaceId(
    id,
    workspaceId
  );

  if (!project) {
    throw new ProjectNotFoundError();
  }

  return project;
};

export const createProject = async (
  workspaceId,
  { title, statuses, tags, icon }
) => {
  const projectExists = await projectRepository.findProjectByTitle(
    title,
    workspaceId
  );

  if (projectExists) {
    throw new ProjectAlreadyExists();
  }

  return await projectRepository.createProject({
    title,
    statuses,
    tags,
    icon,
    workspace: workspaceId,
  });
};

export const updateProject = async (
  id,
  workspaceId,
  { title, statuses, tags, icon }
) => {
  const projectExists = await projectRepository.findProjectById(
    id,
    workspaceId
  );

  if (!projectExists) {
    throw new ProjectNotFoundError();
  }

  return await projectRepository.updateProject(id, workspaceId, {
    title,
    statuses,
    tags,
    icon,
  });
};

export const deleteProject = async (id, workspaceId) => {
  const projectExists = await projectRepository.findProjectByIdAndWorkspaceId(
    id,
    workspaceId
  );

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
