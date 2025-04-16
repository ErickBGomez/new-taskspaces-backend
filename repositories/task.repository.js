import Task from '../models/task.model.js';

// TODO: Document these lines
export const findAllTasks = async (projectId) => {
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

export const updateTask = async (id, projectId, task) => {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: id, project: projectId },
    task,
    {
      new: true,
    }
  );

  await updatedTask.populate('assignedMembers');

  return updatedTask;
};

export const deleteTask = async (id, projectId) => {
  return await Task.findOneAndDelete({ _id: id, project: projectId });
};
