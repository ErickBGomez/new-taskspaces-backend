import Tag from '../models/tag.model.js';
import Task from '../models/task.model.js';

export const findAllTags = async () => {
  return await Tag.find();
};

export const findTagsByProjectId = async (projectId) => {
  return await Tag.find({ project: projectId });
};

export const findTagById = async (id) => {
  return await Tag.findById(id);
};

export const findTagsByTaskId = async (taskId) => {
  const task = await Task.findById(taskId).populate('tags');
  return task?.tags;
};

export const createTag = async (tag) => {
  return await Tag.create(tag);
};

export const assignTagToTask = async (id, taskId) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $push: { tags: id } },
    { new: true }
  );
};

export const updateTag = async (id, tag) => {
  return await Tag.findByIdAndUpdate(id, tag, {
    new: true,
  });
};

export const deleteTag = async (id) => {
  return await Tag.findByIdAndDelete(id);
};
