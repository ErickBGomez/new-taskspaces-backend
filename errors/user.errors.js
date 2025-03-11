export class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(error) {
    super('User already exists');
    this.name = 'UserAlreadyExistsError';
    this.error = error;
  }
}

export class IncorrectCredentialsError extends Error {
  constructor(message = 'Incorrect credentials') {
    super(message);
    this.name = 'IncorrectCredentialsError';
  }
}

export class PasswordDoNotMatchError extends Error {
  constructor(message = 'Passwords do not match') {
    super(message);
    this.name = 'PasswordDoNotMatchError';
  }
}

export class SameOldPasswordError extends Error {
  constructor(message = 'New password must be different from the old one') {
    super(message);
    this.name = 'SameOldPasswordError';
  }
}
