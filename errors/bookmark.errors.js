export class BookmarkNotFoundError extends Error {
  constructor(message = 'Bookmark not found') {
    super(message);
    this.name = 'BookmarkNotFoundError';
  }
}

export class BookmarkAlreadyExists extends Error {
  constructor(message = 'Bookmark already exists') {
    super(message);
    this.name = 'BookmarkAlreadyExists';
  }
}
