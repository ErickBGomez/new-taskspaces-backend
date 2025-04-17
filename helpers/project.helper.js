import { findProjectById } from '../repositories/project.repository.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';

export const findWorkspaceIdByProjectId = async (projectId) => {
  const project = await findProjectById(projectId);

  if (!project) throw new ProjectNotFoundError();

  if (!project.workspace) throw new WorkspaceNotFoundError();

  return project.workspace;
};
