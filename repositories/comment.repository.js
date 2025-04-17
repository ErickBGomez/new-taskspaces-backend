import Comment from '../models/comment.model.js';

export const findAllComments = async () => {
  return await Comment.find().populate('author', 'username avatar');
};

export const findCommentsByTaskId = async (taskId) => {
  return await Comment.find({ task: taskId }).populate(
    'author',
    'username avatar'
  );
};

export const findCommentById = async (id) => {
  return await Comment.findById(id);
};

export const createComment = async (comment) => {
  return await Comment.create(comment).then((newComment) =>
    newComment.populate('author', 'username avatar')
  );
};

export const updateComment = async (id, comment) => {
  return await Comment.findByIdAndUpdate(id, comment, {
    new: true,
  });
};

export const deleteComment = async (id) => {
  return await Comment.findByIdAndDelete(id);
};
