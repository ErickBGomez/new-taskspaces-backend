import * as mediaRepository from '../repositories/media.repository.js';
import * as userRepository from '../repositories/user.repository.js';
import * as taskRepository from '../repositories/task.repository.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';

export const uploadMediaToTask = async (
  { filename, type, url },
  authorId,
  taskId
) => {
  const userExists = await userRepository.findUserById(authorId);
  if (!userExists) throw new UserNotFoundError();

  const taskExists = await taskRepository.findTaskById(taskId);
  if (!taskExists) throw new TaskNotFoundError();

  return await mediaRepository.uploadMediaToTask(
    { filename, type, url },
    authorId,
    taskId
  );
};

export const uploadMedia = async ({ filename, type, url }, authorId) => {
  const userExists = await userRepository.findUserById(authorId);
  if (!userExists) throw new UserNotFoundError();

  return await mediaRepository.uploadMedia({ filename, type, url }, authorId);
};
