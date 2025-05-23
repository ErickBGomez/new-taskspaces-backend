import * as taskRepository from '../repositories/task.repository.js';
import * as projectRepository from '../repositories/project.repository.js';
import * as projectHelper from '../helpers/project.helper.js';
import * as workspaceRepository from '../repositories/workspace.repository.js';
import { TaskNotFoundError } from '../errors/task.errors.js';
import { ProjectNotFoundError } from '../errors/project.errors.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { UserNotFoundError } from '../errors/user.errors.js';

// Helper function to transform Prisma task data to your API format
const parseTaskData = (task) => {
  if (!task) return null;

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status?.value || task.status, // Handle both object and string cases
    date: task.date,
    timer: task.timer,
    // Transform assigned users from relational structure
    assignedMembers: task.assignedUsers?.map((au) => au.user) || [],
    // Transform tags from relational structure
    tags: task.tags?.map((tt) => tt.tag) || [],
    project: task.project || task.projectId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    // Include comments if present
    comments: task.comments || [],
  };
};

// Helper function to transform multiple tasks
const transformTasksData = (tasks) => {
  return tasks.map(parseTaskData);
};

export const findAllTasks = async () => {
  const tasks = await taskRepository.findAllTasks();
  return transformTasksData(tasks);
};

export const findTasksByProjectId = async (projectId) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  const tasks = await taskRepository.findTasksByProjectId(projectId);
  return transformTasksData(tasks);
};

export const findTaskById = async (id) => {
  const task = await taskRepository.findTaskById(id);

  if (!task) throw new TaskNotFoundError();

  return parseTaskData(task);
};

export const createTask = async (
  projectId,
  { title, description, status, date, timer, assignedMembers }
) => {
  const projectExists = await projectRepository.findProjectById(projectId);

  if (!projectExists) throw new ProjectNotFoundError();

  // Convert status string to statusId if needed
  let statusId = 1; // Default to PENDING
  if (status) {
    // You might need to create a helper to convert status string to ID
    // For now, assuming you have a mapping or will handle this
    switch (status.toLowerCase()) {
      case 'pending':
        statusId = 1;
        break;
      case 'doing':
        statusId = 2;
        break;
      case 'done':
        statusId = 3;
        break;
      default:
        statusId = 1;
    }
  }

  const createdTask = await taskRepository.createTask({
    title,
    description,
    date,
    timer,
    assignedMembers, // This will be handled in the repository
    projectId: parseInt(projectId),
    statusId,
  });

  return parseTaskData(createdTask);
};

export const updateTask = async (
  id,
  { title, description, status, date, timer }
) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  // Convert status string to statusId if provided
  let updateData = {
    title,
    description,
    date,
    timer,
  };

  if (status) {
    switch (status.toLowerCase()) {
      case 'pending':
        updateData.statusId = 1;
        break;
      case 'doing':
        updateData.statusId = 2;
        break;
      case 'done':
        updateData.statusId = 3;
        break;
    }
  }

  const updatedTask = await taskRepository.updateTask(id, updateData);
  return parseTaskData(updatedTask);
};

export const deleteTask = async (id) => {
  const taskExists = await taskRepository.findTaskById(id);

  if (!taskExists) throw new TaskNotFoundError();

  const deletedTask = await taskRepository.deleteTask(id);
  return parseTaskData(deletedTask);
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

  // Assign member and return updated task
  await taskRepository.assignMemberToTask(id, memberId);

  // Fetch the updated task to return complete data
  const updatedTask = await taskRepository.findTaskById(id);
  return parseTaskData(updatedTask);
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

  // Unassign member and return updated task
  await taskRepository.unassignMemberToTask(id, memberId);

  // Fetch the updated task to return complete data
  const updatedTask = await taskRepository.findTaskById(id);
  return parseTaskData(updatedTask);
};
