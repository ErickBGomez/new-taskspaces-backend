import * as tagRepository from '../repositories/tag.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import * as taskRepository from '../repositories/task.repository.js';
import { TagAlreadyAssigned, TagNotFoundError } from '../errors/tag.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';

export const findAllTags = async () => {
  return await tagRepository.findAllTags();
};

export const findTagsByProjectId = async (projectId) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  return await tagRepository.findTagsByProjectId(projectId);
};

export const findTagById = async (id) => {
  const tag = await tagRepository.findTagById(id);

  if (!tag) throw new TagNotFoundError();

  return tag;
};

export const findTagsByTaskId = async (taskId) => {
  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  return await tagRepository.findTagsByTaskId(taskId);
};

export const createTag = async ({ title, color }, projectId) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  return await tagRepository.createTag(
    {
      title,
      color,
    },
    projectId
  );
};

export const updateTag = async (id, { title, color }) => {
  const tagExists = await tagRepository.findTagById(id);

  if (!tagExists) throw new TagNotFoundError();

  return await tagRepository.updateTag(id, {
    title,
    color,
  });
};

export const deleteTag = async (id) => {
  const tagExists = await tagRepository.findTagById(id);

  if (!tagExists) throw new TagNotFoundError();

  return await tagRepository.deleteTag(id);
};

export const assignTagToTask = async (id, taskId) => {
  const tagExists = await tagRepository.findTagById(id);

  if (!tagExists) throw new TagNotFoundError();

  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  // Retrieve tags from repository instead of using taskExists object
  // because taskExists model may change, and the response may or not include
  // the tags populated
  const tagsFromTask = await tagRepository.findTagsByTaskId(taskId);
  if (tagsFromTask?.some((tag) => tag._id.toString() === id))
    throw new TagAlreadyAssigned();

  return await tagRepository.assignTagToTask(id, taskId);
};

export const unassignTagFromTask = async (id, taskId) => {
  const tagExists = await tagRepository.findTagById(id);

  if (!tagExists) throw new TagNotFoundError();

  const taskExists = await taskRepository.findTaskById(taskId);

  if (!taskExists) throw new TaskNotFoundError();

  return await tagRepository.unassignTagFromTask(id, taskId);
};
