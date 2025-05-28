import prisma from '../utils/prisma.js';
import { selectWorkspace } from './workspace.repository.js';
import { selectProject } from './project.repository.js';
import { selectTask } from './task.repository.js';
import { selectUser } from './user.repository.js';
import { parseWorkspaceData } from '../helpers/workspace.helper.js';
import { parseProjectData } from '../helpers/project.helper.js';
import { parseTaskData } from '../helpers/task.helper.js';
import { parseUserData } from '../helpers/user.helper.js';

export const searchAllAdmin = async (query) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' },
    },
    select: { ...selectWorkspace },
  });

  const projects = await prisma.project.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' },
    },
    select: { ...selectProject },
  });

  const tasks = await prisma.task.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' },
    },
    select: { ...selectTask },
  });

  const users = await prisma.user_app.findMany({
    where: {
      OR: [
        { fullname: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { ...selectUser },
  });

  return {
    workspaces: workspaces.map((workspace) => parseWorkspaceData(workspace)),
    projects: projects.map((project) => parseProjectData(project)),
    tasks: tasks.map((task) => parseTaskData(task)),
    users: users.map((user) => parseUserData(user)),
  };
};

// Add shared workspaces
export const searchAll = async (query, userId) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' },
      owner_id: parseInt(userId),
    },
    select: { ...selectWorkspace },
  });

  const projects = await prisma.project.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' },
      workspace: {
        owner_id: parseInt(userId),
      },
    },
    select: { ...selectProject },
  });

  const tasks = await prisma.task.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' },
      project: {
        workspace: {
          owner_id: parseInt(userId),
        },
      },
    },
    select: { ...selectTask },
  });

  const users = await prisma.user_app.findMany({
    where: {
      OR: [
        { fullname: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: { ...selectUser },
  });

  return {
    workspaces: workspaces.map((workspace) => parseWorkspaceData(workspace)),
    projects: projects.map((project) => parseProjectData(project)),
    tasks: tasks.map((task) => parseTaskData(task)),
    users: users.map((user) => parseUserData(user)),
  };
};
