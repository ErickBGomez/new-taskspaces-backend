import * as taskRepository from '../repositories/task.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import * as projectHelper from '../helpers/project.helper.js';
import * as workspaceRepository from '../repositories/workspace.repository.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import { findWorkspaceIdFromTask } from '../helpers/task.helper.js';

export const findAllTasks = async () => {
  return await taskRepository.findAllTasks();
};

export const findTasksByProjectId = async (projectId) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  return await taskRepository.findTasksByProjectId(projectId);
};

export const findTaskById = async (id) => {
  const task = await taskRepository.findTaskById(id);

  if (!task) throw new TaskNotFoundError();

  return task;
};

// TODO: Add assignedMembers to the task
/* Date can be to the following format:
  - YYYY-MM-DD
  - YYYY-MM-DDTHH:mm:ss
  - YYYY-MM-DD HH:mm:ss
  - MM-DD-YYYY
  - MM-DD-YYYYTHH:mm:ss
  - MM-DD-YYYY HH:mm:ss
*/
export const createTask = async (
  projectId,
  { title, description, status, date, timer }
) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  return await taskRepository.createTask({
    title,
    description,
    status,
    date: new Date(date),
    timer,
    projectId,
  });
};

export const updateTask = async (
  id,
  { title, description, status, date, timer }
) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.updateTask(id, {
    title,
    description,
    status,
    date,
    timer,
  });
};

export const deleteTask = async (id) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.deleteTask(id);
};

export const assignMemberToTask = async (id, memberId) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  const workspaceId = await findWorkspaceIdFromTask(id);
  if (!workspaceId) throw new WorkspaceNotFoundError();

  const memberExists = await workspaceRepository.findMember(
    workspaceId,
    memberId
  );
  if (!memberExists) throw new UserNotFoundError();

  return await taskRepository.assignMemberToTask(id, memberId);
};

export const unassignMemberToTask = async (id, memberId) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  const workspaceId = await findWorkspaceIdFromTask(id);
  if (!workspaceId) throw new WorkspaceNotFoundError();

  const memberExists = await workspaceRepository.findMember(
    workspaceId,
    memberId
  );
  if (!memberExists) throw new UserNotFoundError();

  return await taskRepository.unassignMemberToTask(id, memberId);
};
