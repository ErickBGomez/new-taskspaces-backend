export const parseTagData = (tag) => {
  if (!tag) return null;

  const { created_at, updated_at, ...tagData } = tag;

  return {
    ...tagData,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
