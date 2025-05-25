export const parseCommentData = (comment) => {
  if (!comment) return null;

  // eslint-disable-next-line no-unused-vars
  const { user_app, created_at, updated_at, ...commentData } = comment;

  return {
    ...commentData,
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
