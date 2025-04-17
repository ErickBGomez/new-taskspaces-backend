import { findTaskById } from '../repositories/task.repository.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';

export const findProjectIdByTaskId = async (taskId) => {
  const task = await findTaskById(taskId);

  if (!task) throw new TaskNotFoundError();

  if (!task.project) throw new ProjectNotFoundError();

  return task.project;
};
