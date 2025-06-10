export const parseMediaData = (media) => {
  if (!media) return null;

  const { created_at, updated_at, ...mediaData } = media;

  return {
    ...mediaData,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};

// Helper function to get file extension from mimetype
export const getFileExtension = (mimetype) => {
  const extensions = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
  };
  return extensions[mimetype] || '.jpg';
};
