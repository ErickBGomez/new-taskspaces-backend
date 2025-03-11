import * as commentRepository from '../repositories/comment.repository.js';
import { CommentNotFoundError } from '../errors/comment.errors.js';

export const findAllComments = async (taskId) => {
  return await commentRepository.findAllComments(taskId);
};

export const findCommentById = async (id, taskId) => {
  const comment = await commentRepository.findCommentById(id, taskId);

  if (!comment) {
    throw new CommentNotFoundError();
  }

  return comment;
};

export const createComment = async (taskId, { author, content, mentions }) => {
  return await commentRepository.createComment({
    author,
    content,
    mentions,
    task: taskId,
  });
};

export const updateComment = async (
  id,
  taskId,
  { author, content, mentions }
) => {
  const commentExists = await commentRepository.findCommentById(id, taskId);

  if (!commentExists) {
    throw new CommentNotFoundError();
  }

  return await commentRepository.updateComment(id, taskId, {
    author,
    content,
    mentions,
  });
};

export const deleteComment = async (id, taskId) => {
  const commentExists = await commentRepository.findCommentById(id, taskId);

  if (!commentExists) {
    throw new CommentNotFoundError();
  }

  return await commentRepository.deleteComment(id, taskId);
};
