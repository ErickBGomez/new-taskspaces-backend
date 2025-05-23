import { parseProjectData } from '../helpers/project.helper.js';
import prisma from '../utils/prisma.js';

export const findAllProjects = async () => {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
  });

  return projects.map((project) => parseProjectData(project));
};

export const findProjectsByWorkspaceId = async (workspaceId) => {
  const projects = await prisma.project.findMany({
    where: {
      workspace_id: parseInt(workspaceId),
    },
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
  });

  return projects.map((project) => parseProjectData(project));
};

export const findProjectById = async (id) => {
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseProjectData(project);
};

export const findProjectByIdAndWorkspaceId = async (id, workspaceId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: parseInt(id),
      workspace_id: parseInt(workspaceId),
    },
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseProjectData(project);
};

export const findProjectByTitle = async (title, workspaceId) => {
  const project = await prisma.project.findFirst({
    where: {
      title,
      workspace_id: parseInt(workspaceId),
    },
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseProjectData(project);
};

export const createProject = async (project) => {
  const { workspaceId, ...projectData } = project;

  const createdProject = await prisma.project.create({
    data: {
      ...projectData,
      workspace_id: parseInt(workspaceId),
    },
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
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
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseProjectData(updatedProject);
};

export const deleteProject = async (id) => {
  const deletedProject = await prisma.project.delete({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      title: true,
      icon: true,
      created_at: true,
      updated_at: true,
    },
  });

  return parseProjectData(deletedProject);
};
