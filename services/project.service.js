import * as projectRepository from '../repositories/project.repository.js';
import * as workspaceService from './workspace.service.js';
import {
  ProjectNotFoundError,
  ProjectAlreadyExists,
} from '../errors/project.errors.js';

export const findAllProjects = async (workspaceId) => {
  return await projectRepository.findAllProjects(workspaceId);
};

export const findGlobalProjects = async () => {
  return await projectRepository.findGlobalProjects();
};

export const getRoleFromProject = async (projectId, userId) => {
  const allProjects = await findGlobalProjects();
  const currentProject = allProjects.find(
    (project) => project._id.toString() === projectId
  );

  if (!currentProject) {
    throw new ProjectNotFoundError();
  }

  const workspaceId = currentProject.workspace;

  return await workspaceService.getUserRole(workspaceId, userId);
};

export const findProjectById = async (id, workspaceId) => {
  const project = await projectRepository.findProjectById(id, workspaceId);

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
  const projectExists = await projectRepository.findProjectById(
    id,
    workspaceId
  );

  if (!projectExists) {
    throw new ProjectNotFoundError();
  }

  return await projectRepository.deleteProject(id);
};
