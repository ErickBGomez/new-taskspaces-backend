import * as commentRepository from '../repositories/comment.repository.js';
import * as taskRepository from '../repositories/task.repository.js';
import { CommentNotFoundError } from '../errors/comment.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';

export const findAllComments = async () => {
  return await commentRepository.findAllComments();
};

export const findCommentsByTaskId = async (taskId) => {
  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  return await commentRepository.findCommentsByTaskId(taskId);
};

export const findCommentById = async (id) => {
  const comment = await commentRepository.findCommentById(id);

  if (!comment) throw new CommentNotFoundError();

  return comment;
};

export const createComment = async (taskId, { authorId, content }) => {
  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  return await commentRepository.createComment({
    authorId,
    content,
    taskId,
  });
};

export const updateComment = async (id, { content }) => {
  const commentExists = await commentRepository.findCommentById(id);

  if (!commentExists) throw new CommentNotFoundError();

  return await commentRepository.updateComment(id, {
    content,
  });
};

export const deleteComment = async (id) => {
  const commentExists = await commentRepository.findCommentById(id);

  if (!commentExists) throw new CommentNotFoundError();

  return await commentRepository.deleteComment(id);
};
