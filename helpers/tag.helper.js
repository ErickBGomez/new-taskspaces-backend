import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { findWorkspaceIdByTag } from '../repositories/tag.repository.js';

export const findWorkspaceIdFromTag = async (tagId) => {
  const workspaceId = await findWorkspaceIdByTag(tagId);

  if (!workspaceId) throw new WorkspaceNotFoundError();

  return workspaceId;
};

export const parseTagData = (tag) => {
  if (!tag) return null;

  const { created_at, updated_at, ...tagData } = tag;

  return {
    ...tagData,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
