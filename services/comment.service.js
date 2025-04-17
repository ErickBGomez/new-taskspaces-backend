import * as commentRepository from '../repositories/comment.repository.js';
import { CommentNotFoundError } from '../errors/comment.errors.js';

export const findAllComments = async () => {
  return await commentRepository.findAllComments();
};

export const findCommentsByTaskId = async (taskId) => {
  return await commentRepository.findCommentsByTaskId(taskId);
};

export const findCommentById = async (id) => {
  const comment = await commentRepository.findCommentById(id);

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

export const updateComment = async (id, { author, content, mentions }) => {
  const commentExists = await commentRepository.findCommentById(id);

  if (!commentExists) {
    throw new CommentNotFoundError();
  }

  return await commentRepository.updateComment(id, {
    author,
    content,
    mentions,
  });
};

export const deleteComment = async (id) => {
  const commentExists = await commentRepository.findCommentById(id);

  if (!commentExists) {
    throw new CommentNotFoundError();
  }

  return await commentRepository.deleteComment(id);
};
