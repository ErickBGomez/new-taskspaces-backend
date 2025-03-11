import Task from '../models/task.model.js';

// TODO: Document these lines
export const findAllTasks = async (projectId) => {
  return await Task.find({ project: projectId }).populate('members');
};

export const findTaskById = async (id, projectId) => {
  return await Task.findOne({ _id: id, project: projectId }).populate(
    'members'
  );
};

export const createTask = async (task) => {
  const newTask = await Task.create(task);
  await newTask.populate('members');
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

  await updatedTask.populate('members');

  return updatedTask;
};

export const deleteTask = async (id, projectId) => {
  return await Task.findOneAndDelete({ _id: id, project: projectId });
};
