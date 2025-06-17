import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { findWorkspaceIdByTag } from '../repositories/tag.repository.js';

export const findWorkspaceIdFromTag = async (tagId) => {
  const workspaceId = await findWorkspaceIdByTag(tagId);

  if (!workspaceId) throw new WorkspaceNotFoundError();

  return workspaceId;
};

export const parseTagData = (tag) => {
  if (!tag) return null;

  const { project_id, created_at, updated_at, ...tagData } = tag;

  return {
    ...tagData,
    projectId: parseInt(project_id),
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
