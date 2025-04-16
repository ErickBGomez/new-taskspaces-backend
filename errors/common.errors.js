export class InvalidDepthError extends Error {
  constructor(message = 'Invalid depth parameter') {
    super(message);
    this.name = 'InvalidDepthError';
  }
}
