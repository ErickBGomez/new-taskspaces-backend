export class NoMediaUploadedError extends Error {
  constructor(message = 'No media file was uploaded.') {
    super(message);
    this.name = 'NoMediaUploadedError';
  }
}
