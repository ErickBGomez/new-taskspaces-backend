import prisma from '../utils/prisma.js';
import { parseMediaData, parseTaskMediaData } from '../helpers/media.helper.js';

const selectMedia = {
  id: true,
  filename: true,
  type: true,
  url: true,
  created_at: true,
  updated_at: true,
};

const selectTaskMedia = {
  task_id: true,
  media: {
    select: { ...selectMedia },
  },
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
  const media = await prisma.task_media.findMany({
    where: { task_id: parseInt(taskId) },
    select: { task: { select: { ...selectMedia } } },
  });

  return media.map((task_media) => parseMediaData(task_media.task));
};

export const uploadMediaToTask = async (media, authorId, taskId) => {
  const uploadedMedia = await prisma.media.create({
    data: {
      ...media,
      author_id: parseInt(authorId),
    },
    select: { ...selectMedia },
  });

  const uploadedTaskMedia = await prisma.task_media.create({
    data: {
      task_id: parseInt(taskId),
      media_id: uploadedMedia.id,
    },
    select: { ...selectTaskMedia },
  });

  return parseTaskMediaData(uploadedTaskMedia);
};

export const uploadMedia = async (media) => {
  const uploadedMedia = await prisma.media.create({
    data: {
      ...media,
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
