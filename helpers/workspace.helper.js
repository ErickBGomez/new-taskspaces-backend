import { parseUserData } from './user.helper.js';

export const parseWorkspaceData = (workspace) => {
  if (!workspace) return null;

  const { owner_id, created_at, updated_at, ...workspaceData } = workspace;

  return {
    ...workspaceData,
    ownerId: parseInt(owner_id),
    createdAt: created_at,
    updatedAt: updated_at,
  };
};

export const parseWorkspaceMember = (member) => {
  if (!member) return null;

  const { user_app, member_role, ...memberData } = member;

  return {
    ...memberData,
    user: parseUserData(user_app),
    memberRole: member_role?.value,
  };
};
