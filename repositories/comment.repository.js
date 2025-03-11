import Comment from '../models/comment.model.js';

export const findAllComments = async (taskId) => {
  return await Comment.find({ task: taskId }).populate(
    'author',
    'username avatar'
  );
};

export const findCommentById = async (id, taskId) => {
  return await Comment.findOne({ _id: id, task: taskId });
};

export const createComment = async (comment) => {
  return await Comment.create(comment).then((newComment) =>
    newComment.populate('author', 'username avatar')
  );
};

export const updateComment = async (id, taskId, comment) => {
  return await Comment.findOneAndUpdate({ _id: id, task: taskId }, comment, {
    new: true,
  });
};

export const deleteComment = async (id, taskId) => {
  return await Comment.findOneAndDelete({ _id: id, task: taskId });
};
