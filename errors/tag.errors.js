export class TagNotFoundError extends Error {
  constructor(message = 'Tag not found') {
    super(message);
    this.name = 'TagNotFoundError';
  }
}

export class TagAlreadyAssigned extends Error {
  constructor(message = 'Tag already assigned to that task') {
    super(message);
    this.name = 'TagAlreadyAssigned';
  }
}
