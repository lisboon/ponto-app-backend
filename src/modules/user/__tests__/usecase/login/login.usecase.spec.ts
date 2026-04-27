import LoginUseCase from '../../../usecase/login/login.usecase';
import { User } from '../../../domain/user.entity';
import { BadLoginError } from '@/modules/@shared/domain/errors/bad-login.error';
import { UserRole } from '@/modules/@shared/domain/enums';

const validUser = (
  overrides: Partial<Parameters<typeof User.create>[0]> = {},
) =>
  User.create({
    email: 'maria@studio.local',
    name: 'Maria',
    password: 'hashed:abc',
    role: UserRole.ADMIN,
    ...overrides,
  });

const makeSut = (user: User | null = null) => {
  const userGateway = {
    findByEmail: jest.fn().mockResolvedValue(user),
    findById: jest.fn(),
    existsByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    search: jest.fn(),
  };
  const passwordHashService = {
    hash: jest.fn(),
    compare: jest.fn().mockResolvedValue(true),
  };
  const jwtTokenService = {
    sign: jest.fn().mockReturnValue('signed.jwt.token'),
    verify: jest.fn(),
  };
  const useCase = new LoginUseCase(
    userGateway,
    passwordHashService,
    jwtTokenService,
  );
  return { useCase, userGateway, passwordHashService, jwtTokenService };
};

describe('LoginUseCase', () => {
  it('retorna accessToken + user quando credenciais ok', async () => {
    const user = validUser();
    const { useCase, jwtTokenService } = makeSut(user);

    const out = await useCase.execute({
      email: 'maria@studio.local',
      password: 'plain',
    });

    expect(jwtTokenService.sign).toHaveBeenCalledWith({
      userId: user.id,
      role: UserRole.ADMIN,
    });
    expect(out).toEqual({
      accessToken: 'signed.jwt.token',
      user: {
        id: user.id,
        email: 'maria@studio.local',
        name: 'Maria',
        role: UserRole.ADMIN,
      },
    });
  });

  it('lança BadLoginError quando email não existe', async () => {
    const { useCase } = makeSut(null);
    await expect(
      useCase.execute({ email: 'x@y.z', password: 'p' }),
    ).rejects.toBeInstanceOf(BadLoginError);
  });

  it('lança BadLoginError quando senha confere falso', async () => {
    const user = validUser();
    const { useCase, passwordHashService } = makeSut(user);
    passwordHashService.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: user.email, password: 'wrong' }),
    ).rejects.toBeInstanceOf(BadLoginError);
  });

  it('lança BadLoginError quando usuário está inativo', async () => {
    const user = validUser();
    user.deactivate();
    const { useCase } = makeSut(user);

    await expect(
      useCase.execute({ email: user.email, password: 'plain' }),
    ).rejects.toBeInstanceOf(BadLoginError);
  });
});
