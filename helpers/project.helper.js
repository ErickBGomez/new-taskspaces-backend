import {
  findProjectById,
  findWorkspaceIdByProjectId as test,
} from '../repositories/project.repository.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';

export const findWorkspaceIdByProjectId = async (projectId) => {
  const project = await findProjectById(projectId);

  if (!project) throw new ProjectNotFoundError();

  if (!project.workspace) throw new WorkspaceNotFoundError();

  return project.workspace;
};

export const findWorkspaceIdFromProject = async (projectId) => {
  const workspaceId = await test(projectId);

  if (!workspaceId) throw new WorkspaceNotFoundError();

  return workspaceId;
};

export const parseProjectData = (project) => {
  if (!project) return null;

  const { created_at, updated_at, ...projectData } = project;

  return {
    ...projectData,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
