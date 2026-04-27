export class NotFoundError extends Error {
  public status = 404;

  constructor(identifier: string, entity?: { name: string }) {
    const message = entity
      ? `${entity.name} não encontrado: ${identifier}`
      : `Recurso não encontrado: ${identifier}`;
    super(message);
    this.name = 'NotFoundError';
  }
}
