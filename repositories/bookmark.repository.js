import prisma from '../utils/prisma.js';
import { parseBookmarkData } from '../helpers/bookmark.helper.js';
import { selectTask } from './task.repository.js';

const selectBookmark = {
  created_at: true,
  task: {
    select: { ...selectTask },
  },
};

export const findAllBookmarks = async () => {
  const bookmarks = await prisma.bookmark.findMany({
    select: { ...selectBookmark },
  });

  return bookmarks.map((bookmark) => parseBookmarkData(bookmark));
};

export const findBookmarksByUserId = async (userId) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      user_id: parseInt(userId),
    },
    select: { ...selectBookmark },
  });

  return bookmarks.map((bookmark) => parseBookmarkData(bookmark));
};

export const findBookmarksByTaskId = async (taskId) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      task_id: parseInt(taskId),
    },
    select: { ...selectBookmark },
  });

  return bookmarks.map((bookmark) => parseBookmarkData(bookmark));
};

export const findBookmarkByUserIdAndTaskId = async (userId, taskId) => {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      user_id: parseInt(userId),
      task_id: parseInt(taskId),
    },
    select: { ...selectBookmark },
  });

  return parseBookmarkData(bookmark);
};

export const createBookmark = async (userId, taskId) => {
  const bookmark = await prisma.bookmark.create({
    data: {
      user_id: parseInt(userId),
      task_id: parseInt(taskId),
    },
    select: { ...selectBookmark },
  });

  return parseBookmarkData(bookmark);
};

export const deleteBookmark = async (userId, taskId) => {
  const bookmark = await prisma.bookmark.delete({
    where: {
      user_id_task_id: {
        user_id: parseInt(userId),
        task_id: parseInt(taskId),
      },
    },
    select: { ...selectBookmark },
  });

  return parseBookmarkData(bookmark);
};
