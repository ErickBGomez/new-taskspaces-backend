import {
  BookmarkAlreadyExists,
  BookmarkNotFoundError,
} from '../errors/bookmark.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import ErrorResponseBuilder from '../helpers/error-response-builder.js';
import SuccessResponseBuilder from '../helpers/success-response-builder.js';
import * as bookmarkService from '../services/bookmark.service.js';

export const getAllBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await bookmarkService.findAllBookmarks();

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Bookmarks found')
          .setContent(bookmarks)
          .build()
      );
  } catch (error) {
    next(error);
  }
};

export const getUserBookmarks = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const bookmarks = await bookmarkService.findBookmarksByUserId(userId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Bookmarks found')
          .setContent(bookmarks)
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const getBookmarksByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const bookmarks = await bookmarkService.findBookmarksByTaskId(taskId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Bookmarks found')
          .setContent(bookmarks)
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

export const getBookmarkByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { id: userId } = req.user;

    const bookmark = await bookmarkService.findBookmarkByUserIdAndTaskId(
      userId,
      taskId
    );

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Bookmark found')
          .setContent(bookmark)
          .build()
      );
  } catch (error) {
    if (error instanceof BookmarkNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Bookmark not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const createBookmark = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { id: userId } = req.user;

    const bookmark = await bookmarkService.createBookmark(userId, taskId);

    res
      .status(201)
      .json(
        new SuccessResponseBuilder()
          .setStatus(201)
          .setMessage('Bookmark created')
          .setContent(bookmark)
          .build()
      );
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('User not found')
            .setError(error.message)
            .build()
        );

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

    if (error instanceof BookmarkAlreadyExists)
      return res
        .status(409)
        .json(
          new ErrorResponseBuilder()
            .setStatus(409)
            .setMessage('Bookmark already exists')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};

export const deleteBookmark = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { id: userId } = req.user;

    await bookmarkService.deleteBookmark(userId, taskId);

    res
      .status(200)
      .json(
        new SuccessResponseBuilder()
          .setStatus(200)
          .setMessage('Bookmark deleted')
          .build()
      );
  } catch (error) {
    if (error instanceof BookmarkNotFoundError)
      return res
        .status(404)
        .json(
          new ErrorResponseBuilder()
            .setStatus(404)
            .setMessage('Bookmark not found')
            .setError(error.message)
            .build()
        );

    next(error);
  }
};
