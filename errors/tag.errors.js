export class TagNotFoundError extends Error {
  constructor(message = 'Tag not found') {
    super(message);
    this.name = 'TagNotFoundError';
  }
}
