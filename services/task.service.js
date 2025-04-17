import * as taskRepository from '../repositories/task.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';

export const findAllTasks = async () => {
  return await taskRepository.findAllTasks();
};

export const findTasksByProjectId = async (projectId) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  return await taskRepository.findTasksByProjectId(projectId);
};

export const findTaskById = async (id) => {
  const task = await taskRepository.findTaskById(id);

  if (!task) throw new TaskNotFoundError();

  return task;
};

export const createTask = async (
  projectId,
  { title, description, status, tags, date, timer, assignedMembers }
) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  return await taskRepository.createTask({
    title,
    description,
    status,
    tags,
    date,
    timer,
    assignedMembers,
    project: projectId,
  });
};

export const updateTask = async (
  id,
  { title, description, status, tags, date, timer, assignedMembers }
) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.updateTask(id, {
    title,
    description,
    status,
    tags,
    date,
    timer,
    assignedMembers,
  });
};

export const deleteTask = async (id) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.deleteTask(id);
};
