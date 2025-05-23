export const parseWorkspaceData = (workspace) => {
  if (!workspace) return null;

  const { created_at, updated_at, ...workspaceData } = workspace;

  return {
    ...workspaceData,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};

export const parseWorkspaceMember = (member) => {
  if (!member) return null;

  const { user_app, member_role, ...memberData } = member;

  return {
    ...memberData,
    user: user_app,
    memberRole: member_role?.value,
  };
};
