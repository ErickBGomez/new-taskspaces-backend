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

export class InvalidMemberRoleError extends Error {
  constructor(message = 'Invalid member role or member role not provided') {
    super(message);
    this.name = 'InvalidMemberRole';
  }
}
