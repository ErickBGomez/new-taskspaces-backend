export const parseMemberRoleData = (data) => {
  if (!data) return null;

  return {
    role: data.member_role.value,
  };
};
