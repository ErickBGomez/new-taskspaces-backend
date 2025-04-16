export class WorkspaceNotFoundError extends Error {
  constructor(message = 'Workspace not found') {
    super(message);
    this.name = 'WorkspaceNotFoundError';
  }
}

export class WorkspaceAlreadyExistsError extends Error {
  constructor(message = 'Workspace already exists') {
    super(message);
    this.name = 'WorkspaceAlreadyExistsError';
  }
}

export class UserAlreadyInvitedError extends Error {
  constructor(message = 'User is already a member of the workspace') {
    super(message);
    this.name = 'UserAlreadyInvitedError';
  }
}

export class MemberRoleSelfModifiedError extends Error {
  constructor(message = 'Member role cannot be modified by self') {
    super(message);
    this.name = 'MemberRoleSelfModifiedError';
  }
}

export class MemberSelfRemovedError extends Error {
  constructor(message = 'Member cannot be removed by self') {
    super(message);
    this.name = 'MemberSelfRemovedError';
  }
}

export class InvalidMemberRoleError extends Error {
  constructor(message = 'Invalid member role or member role not provided') {
    super(message);
    this.name = 'InvalidMemberRoleError';
  }
}
