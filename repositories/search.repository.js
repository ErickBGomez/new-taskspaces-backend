import prisma from '../utils/prisma.js';
import { selectWorkspace } from './workspace.repository.js';
import { selectProject } from './project.repository.js';
import { selectTask } from './task.repository.js';
import { selectUser } from './user.repository.js';
import { parseWorkspaceData } from '../helpers/workspace.helper.js';
import { parseProjectData } from '../helpers/project.helper.js';
import { parseTaskData } from '../helpers/task.helper.js';
import { parseUserData } from '../helpers/user.helper.js';

// TODO: Include shared workspaces in search results
export const searchWorkspaces = async (query, admin = false, userId = null) => {
  const condition = { title: { contains: query, mode: 'insensitive' } };

  // Search workspaces owned by the user only when user is not an admin
  if (!admin) condition.owner_id = parseInt(userId);

  const workspaces = await prisma.workspace.findMany({
    where: { ...condition },
    select: { ...selectWorkspace },
  });

  return workspaces.map((workspace) => parseWorkspaceData(workspace));
};

export const searchProjects = async (query, admin = false, userId = null) => {
  const condition = { title: { contains: query, mode: 'insensitive' } };

  // Search projects what are owned by the user only when user is not an admin
  if (!admin) condition.workspace = { owner_id: parseInt(userId) };

  const projects = await prisma.project.findMany({
    where: { ...condition },
    select: { ...selectProject },
  });

  return projects.map((project) => parseProjectData(project));
};

export const searchTasks = async (query, admin = false, userId = null) => {
  const condition = { title: { contains: query, mode: 'insensitive' } };

  // Search tasks what are owned by the user only when user is not an admin
  if (!admin) condition.project = { workspace: { owner_id: parseInt(userId) } };

  const tasks = await prisma.task.findMany({
    where: { ...condition },
    select: { ...selectTask },
  });

  return tasks.map((task) => parseTaskData(task));
};

export const searchUsers = async (query) => {
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

  return users.map((user) => parseUserData(user));
};

export const searchAll = async (query, admin, userId) => {
  const workspaces = await searchWorkspaces(query, admin, userId);

  const projects = await searchProjects(query, admin, userId);

  const tasks = await searchTasks(query, admin, userId);

  const users = await searchUsers(query);

  return {
    workspaces,
    projects,
    tasks,
    users,
  };
};
