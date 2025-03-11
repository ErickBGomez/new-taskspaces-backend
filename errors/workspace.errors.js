export class WorkspaceNotFoundError extends Error {
  constructor(message = 'Workspace not found') {
    super(message);
    this.name = 'WorkspaceNotFound';
  }
}

export class WorkspaceAlreadyExistsError extends Error {
  constructor(message = 'Workspace already exists') {
    super(message);
    this.name = 'WorkspaceAlreadyExists';
  }
}
