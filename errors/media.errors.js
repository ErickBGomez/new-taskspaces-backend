export class NoMediaUploadedError extends Error {
  constructor(message = 'No media file was uploaded.') {
    super(message);
    this.name = 'NoMediaUploadedError';
  }
}

export class FileNotSupportedError extends Error {
  constructor(message = 'File type not supported.') {
    super(message);
    this.name = 'FileNotSupportedError';
  }
}
