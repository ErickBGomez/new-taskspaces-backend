import { findWorkspaceIdByTask } from '../repositories/task.repository.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';

export const findWorkspaceIdFromTask = async (taskId) => {
  const workspaceId = await findWorkspaceIdByTask(taskId);

  if (!workspaceId) throw new WorkspaceNotFoundError();

  return workspaceId;
};

export const parseTaskData = (task) => {
  if (!task) return null;

  const {
    timer,
    task_status,
    task_tag,
    task_assigned,
    created_at,
    updated_at,
    ...taskData
  } = task;

  return {
    ...taskData,
    timer: parseInt(timer),
    status: task_status.value,
    tags: task_tag.map((tag) => ({
      ...tag.tag, // Avoid repeated tag field
    })),
    assignedMembers: task_assigned.map((assigned) => ({
      ...assigned.user_app,
    })),
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
