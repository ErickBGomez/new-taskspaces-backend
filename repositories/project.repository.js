import Project from '../models/project.model.js';

export const findAllProjects = async (workspaceId) => {
  return await Project.find({ workspace: workspaceId });
};

export const findGlobalProjects = async () => {
  return await Project.find();
};

export const findProjectById = async (id, workspaceId) => {
  return await Project.findOne({ _id: id, workspace: workspaceId });
};

export const findProjectByTitle = async (title, workspaceId) => {
  return await Project.findOne({ title, workspace: workspaceId });
};

export const createProject = async (project) => {
  return await Project.create(project);
};

export const updateProject = async (id, workspaceId, project) => {
  return await Project.findByIdAndUpdate(
    { _id: id, workspace: workspaceId },
    project,
    { new: true }
  );
};

export const deleteProject = async (id, workspaceId) => {
  return await Project.findOneAndDelete({ _id: id, workspace: workspaceId });
};
