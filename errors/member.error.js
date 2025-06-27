export class MemberNotFoundError extends Error {
  constructor(message = 'Member not found') {
    super(message);
    this.name = 'MemberNotFoundError';
  }
}
