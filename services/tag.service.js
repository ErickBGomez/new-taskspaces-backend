import * as tagRepository from '../repositories/tag.repository.js';
import { TagNotFoundError } from '../errors/tag.errors.js';

export const findAllTags = async (projectId) => {
  return await tagRepository.findAllTags(projectId);
};

export const findTagById = async (id, projectId) => {
  const tag = await tagRepository.findTagById(id, projectId);

  if (!tag) {
    throw new TagNotFoundError();
  }

  return tag;
};

export const createTag = async (projectId, { title, color }) => {
  return await tagRepository.createTag({
    title,
    color,
    project: projectId,
  });
};

// TODO: Validate if task exists
export const assignTagToTask = async (id, taskId) => {
  return await tagRepository.assignTagToTask(id, taskId);
};

export const updateTag = async (id, projectId, { title, color }) => {
  const tagExists = await tagRepository.findTagById(id, projectId);

  if (!tagExists) {
    throw new TagNotFoundError();
  }

  return await tagRepository.updateTag(id, projectId, {
    title,
    color,
  });
};

export const deleteTag = async (id, projectId) => {
  const tagExists = await tagRepository.findTagById(id, projectId);

  if (!tagExists) {
    throw new TagNotFoundError();
  }

  return await tagRepository.deleteTag(id, projectId);
};
