import path from 'path';
import { v4 as uuid } from 'uuid';

export const parseMediaData = (media) => {
  if (!media) return null;

  const { created_at, updated_at, ...mediaData } = media;

  return {
    ...mediaData,
    createdAt: created_at,
    updatedAt: updated_at,
  };
};

// Helper function to generate unique filename
export const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  return `${uuid()}${ext}`;
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
