export class UnauthorizedError extends Error {
  public status = 401;

  constructor(message: string = 'Solicitação não autenticada') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
