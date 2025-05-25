import { parseTaskData } from './task.helper';

export const parseBookmarkData = (bookmark) => {
  if (!bookmark) return null;

  const { created_at, task, ...bookmarkData } = bookmark;

  const parsedTask = parseTaskData(task);

  return {
    ...bookmarkData,
    task: { ...parsedTask },
    createdAt: created_at,
  };
};
