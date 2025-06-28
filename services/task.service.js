import * as taskRepository from '../repositories/task.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import * as workspaceRepository from '../repositories/workspace.repository.js';
import {
  InvalidDateTimeFormatError,
  TaskNotFoundError,
} from '../errors/task.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';
import { findWorkspaceIdFromTask } from '../helpers/task.helper.js';
import { isValidDateTime, toDateObject } from '../helpers/datetime.helper.js';

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
  { title, description, status, deadline, timer },
  projectId
) => {
  const project = await projectRepository.findProjectById(projectId);

  if (!project) throw new ProjectNotFoundError();

  const { workspaceId } = project;
  const workspace = await workspaceRepository.findWorkspaceById(workspaceId);

  if (!workspace) throw new WorkspaceNotFoundError();

  const breadcrumb = `${workspace.title.trim()} / ${project.title.trim()}`;

  if (deadline) {
    if (!isValidDateTime(deadline)) throw new InvalidDateTimeFormatError();
  }

  return await taskRepository.createTask(
    {
      breadcrumb,
      title,
      description,
      status,
      deadline: toDateObject(deadline),
      timer,
    },
    projectId
  );
};

export const updateTask = async (
  id,
  { title, description, status, deadline, timer }
) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  if (deadline) {
    if (!isValidDateTime(deadline)) throw new InvalidDateTimeFormatError();
  }

  return await taskRepository.updateTask(id, {
    title,
    description,
    status,
    deadline: toDateObject(deadline),
    timer,
  });
};

export const deleteTask = async (id) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.deleteTask(id);
};

export const findAssignedMembersByTaskId = async (id) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.findAssignedMembersByTaskId(id);
};

export const findWorkspaceMembersByTaskId = async (id) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) throw new TaskNotFoundError();

  return await taskRepository.findWorkspaceMembersByTaskId(id);
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
