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

export const parseTaskMediaData = (taskMedia) => {
  if (!taskMedia) return null;

  const { task_id, created_at, ...taskMediaData } = taskMedia;

  return {
    taskId: parseInt(task_id),
    createdAt: created_at,
    ...taskMediaData,
  };
};
