export class TaskNotFoundError extends Error {
  constructor(message = 'Task not found') {
    super(message);
    this.name = 'TaskNotFoundError';
  }
}

export class InvalidDateTimeFormatError extends Error {
  constructor(message = 'Invalid datetime format') {
    super(message);
    this.name = 'InvalidDateTimeFormatError';
  }
}
