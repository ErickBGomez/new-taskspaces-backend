export class ProjectNotFoundError extends Error {
  constructor(message = 'Project not found') {
    super(message);
    this.name = 'ProjectNotFoundError';
  }
}

export class ProjectAlreadyExists extends Error {
  constructor(message = 'Project already exists') {
    super(message);
    this.name = 'ProjectAlreadyExists';
  }
}
