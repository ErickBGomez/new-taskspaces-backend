import { parseCommentData } from '../helpers/comment.helper.js';
import prisma from '../utils/prisma.js';

const selectComment = {
  id: true,
  content: true,
  author_id: true,
  task_id: true,
  created_at: true,
  updated_at: true,
  user_app: {
    select: {
      fullname: true,
      username: true,
      avatar: true,
      email: true,
    },
  },
};

export const findAllComments = async () => {
  const comments = await prisma.comment.findMany({
    select: { ...selectComment },
  });

  return comments.map((comment) => parseCommentData(comment));
};

export const findCommentsByTaskId = async (taskId) => {
  const comments = await prisma.comment.findMany({
    where: {
      task_id: parseInt(taskId),
    },
    select: { ...selectComment },
  });

  return comments.map((comment) => parseCommentData(comment));
};

export const findCommentById = async (id) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id: parseInt(id),
    },
    select: { ...selectComment },
  });

  return parseCommentData(comment);
};

// TODO: refactor how payload data and ids are being passed
// Request body should be in the first argument (like content)
// The rest of arguments should be ids (like authorId, taskId)
export const createComment = async (comment, authorId, taskId) => {
  const createdComment = await prisma.comment.create({
    data: {
      ...comment,
      author_id: parseInt(authorId),
      task_id: parseInt(taskId),
    },
    select: { ...selectComment },
  });

  return parseCommentData(createdComment);
};

export const updateComment = async (id, comment) => {
  const updatedComment = await prisma.comment.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...comment,
    },
    select: { ...selectComment },
  });

  return parseCommentData(updatedComment);
};

export const deleteComment = async (id) => {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: parseInt(id),
    },
    select: { ...selectComment },
  });

  return parseCommentData(deletedComment);
};
