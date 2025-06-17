import { parseTaskData } from './task.helper.js';

export const parseBookmarkData = (bookmark) => {
  if (!bookmark) return null;

  const { user_id, task_id, created_at, task, ...bookmarkData } = bookmark;

  const parsedTask = parseTaskData(task);

  return {
    userId: parseInt(user_id),
    taskId: parseInt(task_id),
    ...bookmarkData,
    task: { ...parsedTask },
    createdAt: created_at,
  };
};
