import RegisterUseCase from '../../../usecase/register/register.usecase';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { UserRole } from '@/modules/@shared/domain/enums';

const makeSut = (existsByEmail = false) => {
  const userGateway = {
    existsByEmail: jest.fn().mockResolvedValue(existsByEmail),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn().mockResolvedValue(undefined),
    update: jest.fn(),
    search: jest.fn(),
  };
  const passwordHashService = {
    hash: jest.fn().mockResolvedValue('hashed:secret'),
    compare: jest.fn(),
  };
  const useCase = new RegisterUseCase(userGateway, passwordHashService);
  return { useCase, userGateway, passwordHashService };
};

describe('RegisterUseCase', () => {
  const baseInput = {
    email: 'novo@studio.local',
    name: 'Novo Funcionário',
    password: 'password1234',
  };

  it('cria usuário, hasheia senha e persiste via gateway', async () => {
    const { useCase, userGateway, passwordHashService } = makeSut(false);

    const out = await useCase.execute(baseInput);

    expect(passwordHashService.hash).toHaveBeenCalledWith('password1234');
    expect(userGateway.create).toHaveBeenCalledTimes(1);
    expect(out).toEqual({
      id: expect.any(String),
      email: 'novo@studio.local',
      name: 'Novo Funcionário',
      role: UserRole.EMPLOYEE,
    });
  });

  it('respeita role explícita', async () => {
    const { useCase } = makeSut(false);
    const out = await useCase.execute({ ...baseInput, role: UserRole.ADMIN });
    expect(out.role).toBe(UserRole.ADMIN);
  });

  it('lança EntityValidationError quando email já existe', async () => {
    const { useCase, userGateway, passwordHashService } = makeSut(true);

    await expect(useCase.execute(baseInput)).rejects.toBeInstanceOf(
      EntityValidationError,
    );
    expect(passwordHashService.hash).not.toHaveBeenCalled();
    expect(userGateway.create).not.toHaveBeenCalled();
  });
});
