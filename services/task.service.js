import * as taskRepository from '../repositories/task.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
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
  { title, description, status, date, timer, assignedMembers }
) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.updateTask(id, {
    title,
    description,
    status,
    date,
    timer,
    assignedMembers,
  });
};

export const deleteTask = async (id) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.deleteTask(id);
};

export const assignMemberToTask = async (id, workspaceId, memberId) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  const workspace = workspaceRepository.findWorkspaceById(workspaceId);
  if (!workspace) throw new WorkspaceNotFoundError();

  const memberExists = await workspaceRepository.findMember(
    workspaceId,
    memberId
  );
  if (!memberExists) throw new UserNotFoundError();

  return await taskRepository.assignMemberToTask(id, memberId);
};

export const unassignMemberToTask = async (id, workspaceId, memberId) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  const workspace = workspaceRepository.findWorkspaceById(workspaceId);
  if (!workspace) throw new WorkspaceNotFoundError();

  const memberExists = await workspaceRepository.findMember(
    workspaceId,
    memberId
  );
  if (!memberExists) throw new UserNotFoundError();

  return await taskRepository.unassignMemberToTask(id, memberId);
};
