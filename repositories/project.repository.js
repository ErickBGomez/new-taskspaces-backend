import Project from '../models/project.model.js';

export const findAllProjects = async () => {
  return await Project.find();
};

export const findProjectsByWorkspaceId = async (workspaceId) => {
  return await Project.find({ workspace: workspaceId });
};

export const findProjectById = async (id) => {
  return await Project.findById(id);
};

export const findProjectByIdAndWorkspaceId = async (id, workspaceId) => {
  return await Project.findOne({ _id: id, workspace: workspaceId });
};

export const findProjectByTitle = async (title, workspaceId) => {
  return await Project.findOne({ title, workspace: workspaceId });
};

export const createProject = async (project) => {
  return await Project.create(project);
};

export const updateProject = async (id, project) => {
  return await Project.findByIdAndUpdate(id, project, { new: true });
};

export const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};
