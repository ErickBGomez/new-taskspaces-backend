import { findWorkspaceIdByProjectId } from '../repositories/project.repository.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';

export const findWorkspaceIdFromProject = async (projectId) => {
  const workspaceId = await findWorkspaceIdByProjectId(projectId);

  if (!workspaceId) throw new WorkspaceNotFoundError();

  return workspaceId;
};

export const parseProjectData = (project) => {
  if (!project) return null;

  const { workspace_id, created_at, updated_at, ...projectData } = project;

  return {
    ...projectData,
    workspaceId: parseInt(workspace_id),
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
