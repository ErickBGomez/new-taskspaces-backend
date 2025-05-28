import { parseProjectData } from '../helpers/project.helper.js';
import prisma from '../utils/prisma.js';

const selectProject = {
  id: true,
  title: true,
  icon: true,
  created_at: true,
  updated_at: true,
};

export const findAllProjects = async () => {
  const projects = await prisma.project.findMany({
    select: { ...selectProject },
  });

  return projects.map((project) => parseProjectData(project));
};

export const findProjectsByWorkspaceId = async (workspaceId) => {
  const projects = await prisma.project.findMany({
    where: {
      workspace_id: parseInt(workspaceId),
    },
    select: { ...selectProject },
  });

  return projects.map((project) => parseProjectData(project));
};

export const findProjectById = async (id) => {
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(id),
    },
    select: { ...selectProject },
  });

  return parseProjectData(project);
};

export const findProjectByIdAndWorkspaceId = async (id, workspaceId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: parseInt(id),
      workspace_id: parseInt(workspaceId),
    },
    select: { ...selectProject },
  });

  return parseProjectData(project);
};

export const findProjectByTitle = async (title, workspaceId) => {
  const project = await prisma.project.findFirst({
    where: {
      title,
      workspace_id: parseInt(workspaceId),
    },
    select: { ...selectProject },
  });

  return parseProjectData(project);
};

export const createProject = async (project, workspaceId) => {
  const createdProject = await prisma.project.create({
    data: {
      ...project,
      workspace_id: parseInt(workspaceId),
    },
    select: { ...selectProject },
  });

  return parseProjectData(createdProject);
};

export const updateProject = async (id, project) => {
  const updatedProject = await prisma.project.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...project,
    },
    select: { ...selectProject },
  });

  return parseProjectData(updatedProject);
};

export const deleteProject = async (id) => {
  const deletedProject = await prisma.project.delete({
    where: {
      id: parseInt(id),
    },
    select: { ...selectProject },
  });

  return parseProjectData(deletedProject);
};

export const findWorkspaceIdByProjectId = async (projectId) => {
  const projectFound = await prisma.project.findFirst({
    where: {
      id: parseInt(projectId),
    },
    select: {
      workspace_id: true,
    },
  });

  if (!projectFound) return null;

  return projectFound.workspace_id;
};
