export class CommentNotFoundError extends Error {
  constructor(message = 'Comment not found') {
    super(message);
    this.name = 'CommentNotFoundError';
  }
}
