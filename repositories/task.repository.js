import Task from '../models/task.model.js';

// TODO: Document these lines
export const findAllTasks = async () => {
  return await Task.find();
};

export const findTasksByProjectId = async (projectId) => {
  return await Task.find({ project: projectId }).populate('assignedMembers');
};

export const findTaskById = async (id) => {
  return await Task.findById(id).populate('assignedMembers');
};

export const findTaskByIdAndProjectId = async (id, projectId) => {
  return await Task.findOne({ _id: id, project: projectId }).populate(
    'assignedMembers'
  );
};

export const createTask = async (task) => {
  const newTask = await Task.create(task);
  await newTask.populate('assignedMembers');
  return newTask;
};

export const updateTask = async (id, task) => {
  const updatedTask = await Task.findByIdAndUpdate(id, task, {
    new: true,
  });

  await updatedTask.populate('assignedMembers');

  return updatedTask;
};

export const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

export const assignMemberToTask = async (taskId, memberId) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $push: { assignedMembers: memberId } },
    { new: true }
  );
};

export const unassignMemberToTask = async (taskId, memberId) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $pull: { assignedMembers: memberId } },
    { new: true }
  );
};
