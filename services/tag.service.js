import * as tagRepository from '../repositories/tag.repository.js';
import * as taskRepository from '../repositories/task.repository.js';
import { TagAlreadyAssigned, TagNotFoundError } from '../errors/tag.errors.js';
import { TaskNotFoundError } from '../errors/task.errors.js';

export const findAllTags = async () => {
  return await tagRepository.findAllTags();
};

export const findTagsByProjectId = async (projectId) => {
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

export const createTag = async (projectId, { title, color }) => {
  // TODO: Check if the project exists

  return await tagRepository.createTag({
    title,
    color,
    project: projectId,
  });
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
