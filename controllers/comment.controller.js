import * as commentService from '../services/comment.service.js';
import { CommentNotFoundError } from '../errors/comment.errors.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';

export const getAllComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await commentService.findAllComments(taskId);
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
    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const getCommentById = async (req, res) => {
  try {
    const { id, taskId } = req.params;

    const comment = await commentService.findCommentById(id, taskId);

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

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, mentions } = req.body;
    const author = req.user.id;

    const comment = await commentService.createComment(taskId, {
      author,
      content,
      mentions,
    });

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
    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const { content, mentions } = req.body;
    const author = req.user.id;

    const comment = await commentService.updateComment(id, taskId, {
      author,
      content,
      mentions,
    });

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

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, taskId } = req.params;

    await commentService.deleteComment(id, taskId);

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

    res
      .status(500)
      .json(
        new ErrorResponseBuilder()
          .setStatus(500)
          .setMessage('Internal server error')
          .setError(error.message)
          .build()
      );
  }
};
