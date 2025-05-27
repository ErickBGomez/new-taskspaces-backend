export const parseMediaData = (media) => {
  if (!media) return null;

  const { created_at, updated_at, ...mediaData } = media;

  return {
    ...mediaData,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
