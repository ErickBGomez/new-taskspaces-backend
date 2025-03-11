import Tag from '../models/tag.model.js';
import Task from '../models/task.model.js';

export const findAllTags = async (projectId) => {
  return await Tag.find({ project: projectId });
};

export const findTagById = async (id, projectId) => {
  return await Tag.findOne({ _id: id, project: projectId });
};

export const createTag = async (tag) => {
  return await Tag.create(tag);
};

export const assignTagToTask = async (id, taskId) => {
  return await Task.findOneAndUpdate(
    { _id: taskId },
    { $push: { tags: id } },
    { new: true }
  );
};

export const updateTag = async (id, projectId, tag) => {
  return await Tag.findOneAndUpdate({ _id: id, project: projectId }, tag, {
    new: true,
  });
};

export const deleteTag = async (id, projectId) => {
  return await Tag.findOneAndDelete({ _id: id, project: projectId });
};
