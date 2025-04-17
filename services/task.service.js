import * as taskRepository from '../repositories/task.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import * as projectHelper from '../helpers/project.helper.js';
import * as workspaceRepository from '../repositories/workspace.repository.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';

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

export const createTask = async (
  projectId,
  { title, description, status, date, timer, assignedMembers }
) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  return await taskRepository.createTask({
    title,
    description,
    status,
    date,
    timer,
    assignedMembers,
    project: projectId,
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

export const assignMemberToTask = async (id, projectId, memberId) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  const projectExists = await projectRepository.findProjectById(projectId);
  if (!projectExists) throw new ProjectNotFoundError();

  const workspaceId = (
    await projectHelper.findWorkspaceIdByProjectId(projectId)
  ).toString();
  if (!workspaceId) throw new WorkspaceNotFoundError();

  const memberExists = await workspaceRepository.findMember(
    workspaceId,
    memberId
  );
  if (!memberExists) throw new UserNotFoundError();

  return await taskRepository.assignMemberToTask(id, memberId);
};

export const unassignMemberToTask = async (id, projectId, memberId) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  const projectExists = await projectRepository.findProjectById(projectId);
  if (!projectExists) throw new ProjectNotFoundError();

  const workspaceId = (
    await projectHelper.findWorkspaceIdByProjectId(projectId)
  ).toString();
  if (!workspaceId) throw new WorkspaceNotFoundError();

  const memberExists = await workspaceRepository.findMember(
    workspaceId,
    memberId
  );
  if (!memberExists) throw new UserNotFoundError();

  return await taskRepository.unassignMemberToTask(id, memberId);
};
