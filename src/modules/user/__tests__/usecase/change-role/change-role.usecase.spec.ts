import ChangeRoleUseCase from '../../../usecase/change-role/change-role.usecase';
import { User } from '../../../domain/user.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { UserRole } from '@/modules/@shared/domain/enums';

const makeSut = (user: User | null = null) => {
  const userGateway = {
    findById: jest.fn().mockResolvedValue(user),
    findByEmail: jest.fn(),
    existsByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
    search: jest.fn(),
  };
  const useCase = new ChangeRoleUseCase(userGateway);
  return { useCase, userGateway };
};

const validUser = () =>
  User.create({
    email: 'employee@studio.local',
    name: 'Funcionário',
    password: 'hash',
    role: UserRole.EMPLOYEE,
  });

describe('ChangeRoleUseCase', () => {
  it('promove EMPLOYEE → MANAGER', async () => {
    const user = validUser();
    const { useCase, userGateway } = makeSut(user);

    const out = await useCase.execute({ id: user.id, role: UserRole.MANAGER });

    expect(out.role).toBe(UserRole.MANAGER);
    expect(userGateway.update).toHaveBeenCalledWith(user);
  });

  it('NotFoundError quando usuário não existe', async () => {
    const { useCase } = makeSut(null);
    await expect(
      useCase.execute({
        id: '00000000-0000-4000-8000-000000000000',
        role: UserRole.ADMIN,
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
