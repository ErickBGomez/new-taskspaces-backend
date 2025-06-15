import { parseTagData } from '../helpers/tag.helper.js';
import prisma from '../utils/prisma.js';

export const selectTag = {
  id: true,
  title: true,
  color: true,
  created_at: true,
  updated_at: true,
};

export const findAllTags = async () => {
  const tags = await prisma.tag.findMany({ select: { ...selectTag } });

  return tags.map((tag) => parseTagData(tag));
};

export const findTagsByProjectId = async (projectId) => {
  const tags = await prisma.tag.findMany({
    where: {
      project_id: parseInt(projectId),
    },
    select: { ...selectTag },
  });

  return tags.map((tag) => parseTagData(tag));
};

export const findTagById = async (id) => {
  const tag = await prisma.tag.findFirst({
    where: {
      id: parseInt(id),
    },
    select: { ...selectTag },
  });

  return parseTagData(tag);
};

export const findTagsByTaskId = async (taskId) => {
  const tags = await prisma.tag.findMany({
    where: {
      task_tag: {
        some: {
          task_id: parseInt(taskId),
        },
      },
    },
    select: { ...selectTag },
  });

  return tags.map((tag) => parseTagData(tag));
};

export const createTag = async (tag, projectId) => {
  const createdTag = await prisma.tag.create({
    data: {
      ...tag,
      project_id: parseInt(projectId),
    },
    select: { ...selectTag },
  });

  return parseTagData(createdTag);
};

export const updateTag = async (id, tag) => {
  const updatedTag = await prisma.tag.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...tag,
    },
    select: { ...selectTag },
  });

  return parseTagData(updatedTag);
};

export const deleteTag = async (id) => {
  const deletedTag = await prisma.tag.delete({
    where: {
      id: parseInt(id),
    },
    select: { ...selectTag },
  });

  return parseTagData(deletedTag);
};

export const assignTagToTask = async (id, taskId) => {
  const assignedTagToTask = await prisma.task_tag.create({
    data: {
      task_id: parseInt(taskId),
      tag_id: parseInt(id),
    },
    select: {
      tag: {
        select: { ...selectTag },
      },
    },
  });

  return parseTagData(assignedTagToTask.tag);
};

export const unassignTagFromTask = async (id, taskId) => {
  const unassignedTagFromTask = await prisma.task_tag.delete({
    where: {
      task_id_tag_id: {
        task_id: parseInt(taskId),
        tag_id: parseInt(id),
      },
    },
    select: {
      tag: {
        select: { ...selectTag },
      },
    },
  });

  return parseTagData(unassignedTagFromTask.tag);
};

export const findWorkspaceIdByTag = async (tagId) => {
  const tagFound = await prisma.tag.findFirst({
    where: {
      id: parseInt(tagId),
    },
    select: {
      project: {
        select: {
          workspace_id: true,
        },
      },
    },
  });

  if (!tagFound) return null;

  return tagFound.project.workspace_id;
};
