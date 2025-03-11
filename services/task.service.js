import * as taskRepository from '../repositories/task.repository.js';
import { TaskNotFoundError } from '../errors/task.errors.js';

export const findAllTasks = async (projectId) => {
  return await taskRepository.findAllTasks(projectId);
};

export const findTaskById = async (id, projectId) => {
  const task = await taskRepository.findTaskById(id, projectId);

  if (!task) {
    throw new TaskNotFoundError();
  }

  return task;
};

export const createTask = async (
  projectId,
  { title, description, status, tag, media, date, timer, members }
) => {
  return await taskRepository.createTask({
    title,
    description,
    status,
    tag,
    media,
    date,
    timer,
    members,
    project: projectId,
  });
};

export const updateTask = async (
  id,
  projectId,
  { title, description, status, tag, media, date, timer, members }
) => {
  const taskExists = await taskRepository.findTaskById(id, projectId);

  if (!taskExists) {
    throw new TaskNotFoundError();
  }

  return await taskRepository.updateTask(id, projectId, {
    title,
    description,
    status,
    tag,
    media,
    date,
    timer,
    members,
  });
};

export const deleteTask = async (id, projectId) => {
  const taskExists = await taskRepository.findTaskById(id, projectId);

  if (!taskExists) {
    throw new TaskNotFoundError();
  }

  return await taskRepository.deleteTask(id, projectId);
};
