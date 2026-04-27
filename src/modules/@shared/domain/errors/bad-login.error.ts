export class BadLoginError extends Error {
  public status: number;

  constructor(message: string = 'Endereço de e-mail ou senha incorreto(a)') {
    super(message);
    this.name = 'BadLoginError';
    this.status = 400;
  }
}
