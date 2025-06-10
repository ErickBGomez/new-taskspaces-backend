export const parseMediaData = (media) => {
  if (!media) return null;

  const { author_id, task_id, created_at, updated_at, ...mediaData } = media;

  return {
    ...mediaData,
    authorId: parseInt(author_id),
    taskId: parseInt(task_id),
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
