import {
  BookmarkAlreadyExists,
  BookmarkNotFoundError,
} from '../errors/bookmark.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import * as bookmarkRepository from '../repositories/bookmark.repository.js';
import * as userRepository from '../repositories/user.repository.js';
import * as taskRepository from '../repositories/task.repository.js';
import { TaskNotFoundError } from '../errors/task.errors.js';

export const findAllBookmarks = async () => {
  return await bookmarkRepository.findAllBookmarks();
};

export const findBookmarksByUserId = async (userId) => {
  const userExists = userRepository.findUserById(userId);

  if (!userExists) throw new UserNotFoundError();

  return await bookmarkRepository.findBookmarksByUserId(userId);
};

export const findBookmarksByTaskId = async (taskId) => {
  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  return await bookmarkRepository.findBookmarkByTaskId(taskId);
};

export const findBookmarkById = async (id) => {
  const bookmark = await bookmarkRepository.findBookmarkById(id);

  if (!bookmark) throw new BookmarkNotFoundError();

  return bookmark;
};

export const findBookmarkByUserIdAndTaskId = async (userId, taskId) => {
  const userExists = await userRepository.findUserById(userId);

  if (!userExists) throw new UserNotFoundError();

  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  return await bookmarkRepository.findBookmarkByUserIdAndTaskId(userId, taskId);
};

export const createBookmark = async (userId, taskId) => {
  const userExists = await userRepository.findUserById(userId);

  if (!userExists) throw new UserNotFoundError();

  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  // Check if bookmark already exists
  const bookmarkExists = await bookmarkRepository.findBookmarkByUserIdAndTaskId(
    userId,
    taskId
  );

  if (bookmarkExists) throw new BookmarkAlreadyExists();

  return await bookmarkRepository.createBookmark(userId, taskId);
};

export const deleteBookmark = async (id) => {
  const bookmark = await bookmarkRepository.findBookmarkById(id);

  if (!bookmark) throw new BookmarkNotFoundError();

  return await bookmarkRepository.deleteBookmark(id);
};
