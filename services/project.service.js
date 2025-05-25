import * as projectRepository from '../repositories/project.repository.js';
import * as workspaceRepository from '../repositories/workspace.repository.js';
import {
  ProjectNotFoundError,
  ProjectAlreadyExists,
} from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';

export const findAllProjects = async () => {
  return await projectRepository.findAllProjects();
};

export const findProjectsByWorkspaceId = async (workspaceId) => {
  const workspaceExists =
    await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspaceExists) throw new WorkspaceNotFoundError();

  return await projectRepository.findProjectsByWorkspaceId(workspaceId);
};

export const findProjectById = async (id) => {
  const project = await projectRepository.findProjectById(id);

  if (!project) throw new ProjectNotFoundError();

  return project;
};

export const createProject = async ({ title, icon }, workspaceId) => {
  const workspaceExists =
    await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspaceExists) throw new WorkspaceNotFoundError();

  const projectExists = await projectRepository.findProjectByTitle(
    title,
    workspaceId
  );

  if (projectExists) throw new ProjectAlreadyExists();

  return await projectRepository.createProject(
    {
      title,
      icon,
    },
    workspaceId
  );
};

export const updateProject = async (id, { title, icon }) => {
  const projectExists = await projectRepository.findProjectById(id);

  if (!projectExists) throw new ProjectNotFoundError();

  return await projectRepository.updateProject(id, {
    title,
    icon,
  });
};

export const deleteProject = async (id) => {
  const projectExists = await projectRepository.findProjectById(id);

  if (!projectExists) throw new ProjectNotFoundError();

  return await projectRepository.deleteProject(id);
};
