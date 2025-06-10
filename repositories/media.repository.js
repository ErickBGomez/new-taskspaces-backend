import prisma from '../utils/prisma.js';
import { parseMediaData } from '../helpers/media.helper.js';

const selectMedia = {
  id: true,
  filename: true,
  url: true,
  created_at: true,
  updated_at: true,
};

export const findAllMedia = async () => {
  const media = await prisma.media.findMany({
    select: { ...selectMedia },
  });

  return media.map((medium) => parseMediaData(medium));
};

export const findMediaById = async (id) => {
  const media = await prisma.media.findFirst({
    where: { id: parseInt(id) },
    select: { ...selectMedia },
  });

  return parseMediaData(media);
};

export const findMediaByTaskId = async (taskId) => {
  const media = await prisma.media.findMany({
    where: { taskId: parseInt(taskId) },
    select: { ...selectMedia },
  });

  return media.map((medium) => parseMediaData(medium));
};

export const uploadMedia = async (media, authorId, taskId) => {
  const uploadedMedia = await prisma.media.create({
    data: {
      ...media,
      author_id: parseInt(authorId),
      task_id: parseInt(taskId),
    },
    select: { ...selectMedia },
  });

  return parseMediaData(uploadedMedia);
};

export const updateMedia = async (id, media) => {
  const updatedMedia = await prisma.media.update({
    where: { id: parseInt(id) },
    data: { ...media },
    select: { ...selectMedia },
  });

  return parseMediaData(updatedMedia);
};

export const deleteMedia = async (id) => {
  const deletedMedia = await prisma.media.delete({
    where: { id: parseInt(id) },
    select: { ...selectMedia },
  });

  return parseMediaData(deletedMedia);
};
