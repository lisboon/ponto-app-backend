export class ForbiddenError extends Error {
  public status = 403;

  constructor(message: string = 'O acesso a este recurso é proibido') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
