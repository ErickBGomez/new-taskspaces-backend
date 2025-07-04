export const parseMediaData = (media) => {
  if (!media) return null;

  const { created_at, updated_at, ...mediaData } = media;

  return {
    ...mediaData,
    // authorId: parseInt(author_id),
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
