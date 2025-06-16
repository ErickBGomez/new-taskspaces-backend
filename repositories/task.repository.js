import { parseTaskData } from '../helpers/task.helper.js';
import prisma from '../utils/prisma.js';
import { STATUS_STRING_TO_INT } from '../utils/task.utils.js';
import { selectTag } from './tag.repository.js';
import { selectUser } from './user.repository.js';

export const selectTask = {
  id: true,
  breadcrumb: true,
  title: true,
  description: true,
  deadline: true,
  timer: true,
  project_id: true,
  task_status: {
    select: {
      value: true,
    },
  },
  task_tag: {
    select: {
      tag: {
        select: { ...selectTag },
      },
    },
  },
  task_assigned: {
    select: {
      user_app: {
        select: { ...selectUser },
      },
    },
  },
  created_at: true,
  updated_at: true,
};

// TODO: Document these lines
export const findAllTasks = async () => {
  const tasks = await prisma.task.findMany({
    select: { ...selectTask },
  });

  return tasks.map((task) => parseTaskData(task));
};

export const findTasksByProjectId = async (projectId) => {
  const tasks = await prisma.task.findMany({
    where: {
      project_id: parseInt(projectId),
    },
    select: { ...selectTask },
  });

  return tasks.map((task) => parseTaskData(task));
};

export const findTaskById = async (id) => {
  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(id),
    },
    select: { ...selectTask },
  });

  return parseTaskData(task);
};

export const findTaskByIdAndProjectId = async (id, projectId) => {
  // return await Task.findOne({ _id: id, project: projectId }).populate(
  //   'assignedMembers'
  // );

  const task = await prisma.task.findFirst({
    where: {
      id: parseInt(id),
      project_id: parseInt(projectId),
    },
    select: { ...selectTask },
  });

  return parseTaskData(task);
};

export const createTask = async (task, projectId) => {
  const { status, ...taskData } = task;

  const createdTask = await prisma.task.create({
    data: {
      ...taskData,
      status_id: STATUS_STRING_TO_INT[status] || 1, // Default to PENDING if status is not recognized
      project_id: parseInt(projectId),
    },
    select: { ...selectTask },
  });

  return parseTaskData(createdTask);
};

export const updateTask = async (id, task) => {
  const { status, ...taskData } = task;

  const updatedTask = await prisma.task.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...taskData,
      status_id: STATUS_STRING_TO_INT[status] || 1, // Default to PENDING if status is not recognized
    },
    select: { ...selectTask },
  });

  return parseTaskData(updatedTask);
};

export const deleteTask = async (id) => {
  const deletedTask = await prisma.task.delete({
    where: {
      id: parseInt(id),
    },
    select: { ...selectTask },
  });

  return parseTaskData(deletedTask);
};

export const assignMemberToTask = async (taskId, memberId) => {
  const assignedMemberToTask = await prisma.task_assigned.create({
    data: {
      task_id: parseInt(taskId),
      user_id: parseInt(memberId),
    },
    select: {
      task: {
        select: { ...selectTask },
      },
    },
  });

  return parseTaskData(assignedMemberToTask.task);
};

export const unassignMemberToTask = async (taskId, memberId) => {
  const unassignedMemberToTask = await prisma.task_assigned.delete({
    where: {
      user_id_task_id: {
        user_id: parseInt(memberId),
        task_id: parseInt(taskId),
      },
    },
    select: {
      task: {
        select: { ...selectTask },
      },
    },
  });

  return parseTaskData(unassignedMemberToTask.task);
};

// Helpers (not to consume in the API)
export const findWorkspaceIdByTask = async (taskId) => {
  const taskFound = await prisma.task.findFirst({
    where: {
      id: parseInt(taskId),
    },
    select: {
      project: {
        select: {
          workspace_id: true,
        },
      },
    },
  });

  if (!taskFound) {
    return null;
  }

  return taskFound.project.workspace_id;
};
