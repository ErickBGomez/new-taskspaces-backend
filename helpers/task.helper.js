import { findWorkspaceIdByTask } from '../repositories/task.repository.js';
import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { parseTagData } from './tag.helper.js';
import { parseUserData } from './user.helper.js';

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
    project_id,
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
    projectId: parseInt(project_id),
    tags: task_tag.map((tag) => parseTagData(tag.tag)),
    assignedMembers: task_assigned.map((assigned) =>
      parseUserData(assigned.user_app)
    ),
    createdAt: created_at,
    updatedAt: updated_at,
  };
};
