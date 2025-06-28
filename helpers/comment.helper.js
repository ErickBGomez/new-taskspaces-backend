import { WorkspaceNotFoundError } from '../errors/workspace.errors.js';
import { findWorkspaceIdByComment } from '../repositories/comment.repository.js';

export const findWorkspaceIdFromComment = async (taskId) => {
  const workspaceId = await findWorkspaceIdByComment(taskId);

  if (!workspaceId) throw new WorkspaceNotFoundError();

  return workspaceId;
};

export const parseCommentData = (comment) => {
  if (!comment) return null;

  const {
    author_id,
    task_id,
    // eslint-disable-next-line no-unused-vars
    user_app,
    created_at,
    updated_at,
    ...commentData
  } = comment;

  return {
    ...commentData,
    authorId: parseInt(author_id),
    taskId: parseInt(task_id),
    createdAt: created_at,
    updatedAt: updated_at,
    author: {
      fullname: comment.user_app.fullname,
      username: comment.user_app.username,
      avatar: comment.user_app.avatar,
      email: comment.user_app.email,
    },
  };
};
