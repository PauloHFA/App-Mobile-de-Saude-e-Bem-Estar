export class AuthCancelledError extends Error {
  constructor() {
    super('Login cancelado.');
    this.name = 'AuthCancelledError';
  }
}

