import * as commentService from '../services/comment.service.js';
import { CommentNotFoundError } from '../errors/comment.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import { TaskNotFoundError } from '../errors/task.errors.js';

export const getAllComments = async (req, res, next) => {
  try {
    const comments = await commentService.findAllComments();

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Comments found')
          .setContent(comments)
          .build()
      );
  } catch (error) {
    next(error);
  }
};

export const getCommentsByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await commentService.findCommentsByTaskId(taskId);
    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Comments found')
          .setContent(comments)
          .build()
      );
  } catch (error) {
    if (error instanceof TaskNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Task not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await commentService.findCommentById(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Comment found')
          .setContent(comment)
          .build()
      );
  } catch (error) {
    if (error instanceof CommentNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Comment not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    const comment = await commentService.createComment(
      { content },
      authorId,
      taskId
    );

    res
      .status(201)
      .json(
        new SuccessResponseBuilder()
          .setStatus(201)
          .setMessage('Comment created')
          .setContent(comment)
          .build()
      );
  } catch (error) {
    if (error instanceof TaskNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Task not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await commentService.updateComment(id, { content });

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Comment updated')
          .setContent(comment)
          .build()
      );
  } catch (error) {
    if (error instanceof CommentNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Comment not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    await commentService.deleteComment(id);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Comment deleted')
          .build()
      );
  } catch (error) {
    if (error instanceof CommentNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Comment not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};
