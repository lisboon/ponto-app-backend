import UserFacade from '../../facade/user.facade';
import { User } from '../../domain/user.entity';
import { UserRole } from '@/modules/@shared/domain/enums';

const makeSut = () => {
  const findByIdUseCase = { execute: jest.fn() };
  const registerUseCase = { execute: jest.fn() };
  const loginUseCase = { execute: jest.fn() };
  const updateProfileUseCase = { execute: jest.fn() };
  const changeRoleUseCase = { execute: jest.fn() };
  const assignWorkScheduleUseCase = { execute: jest.fn() };
  const listUsersUseCase = { execute: jest.fn() };
  const deactivateUserUseCase = { execute: jest.fn() };
  const reactivateUserUseCase = { execute: jest.fn() };
  const deleteUserUseCase = { execute: jest.fn() };

  const facade = new UserFacade(
    findByIdUseCase,
    registerUseCase,
    loginUseCase,
    updateProfileUseCase,
    changeRoleUseCase,
    assignWorkScheduleUseCase,
    listUsersUseCase,
    deactivateUserUseCase,
    reactivateUserUseCase,
    deleteUserUseCase,
  );

  return {
    facade,
    findByIdUseCase,
    registerUseCase,
    loginUseCase,
    updateProfileUseCase,
    changeRoleUseCase,
    assignWorkScheduleUseCase,
    listUsersUseCase,
    deactivateUserUseCase,
    reactivateUserUseCase,
    deleteUserUseCase,
  };
};

describe('UserFacade', () => {
  it('register encaminha pro use case', async () => {
    const { facade, registerUseCase } = makeSut();
    registerUseCase.execute.mockResolvedValue({ id: '1' });
    await facade.register({ email: 'a', name: 'b', password: 'c' });
    expect(registerUseCase.execute).toHaveBeenCalled();
  });

  it('login encaminha pro use case', async () => {
    const { facade, loginUseCase } = makeSut();
    loginUseCase.execute.mockResolvedValue({ accessToken: 't' });
    await facade.login({ email: 'a', password: 'b' });
    expect(loginUseCase.execute).toHaveBeenCalled();
  });

  it('findById serializa via toJSON', async () => {
    const { facade, findByIdUseCase } = makeSut();
    const user = User.create({
      email: 'maria@studio.local',
      name: 'Maria',
      password: 'h',
      role: UserRole.ADMIN,
    });
    findByIdUseCase.execute.mockResolvedValue(user);
    const out = await facade.findById({ id: user.id });
    expect(out).toMatchObject({
      id: user.id,
      email: 'maria@studio.local',
      role: UserRole.ADMIN,
    });
    expect(out).not.toHaveProperty('password');
  });

  it('updateProfile / changeRole / list / deactivate / reactivate / delete encaminham', async () => {
    const sut = makeSut();
    sut.updateProfileUseCase.execute.mockResolvedValue({});
    sut.changeRoleUseCase.execute.mockResolvedValue({});
    sut.assignWorkScheduleUseCase.execute.mockResolvedValue({});
    sut.listUsersUseCase.execute.mockResolvedValue({ items: [], total: 0 });
    sut.deactivateUserUseCase.execute.mockResolvedValue({});
    sut.reactivateUserUseCase.execute.mockResolvedValue({});
    sut.deleteUserUseCase.execute.mockResolvedValue({ id: 'x' });

    await sut.facade.updateProfile({ id: 'x' });
    await sut.facade.changeRole({ id: 'x', role: UserRole.ADMIN });
    await sut.facade.assignWorkSchedule({ id: 'x' });
    await sut.facade.list({});
    await sut.facade.deactivate({ id: 'x' });
    await sut.facade.reactivate({ id: 'x' });
    await sut.facade.delete({ id: 'x' });

    expect(sut.updateProfileUseCase.execute).toHaveBeenCalled();
    expect(sut.changeRoleUseCase.execute).toHaveBeenCalled();
    expect(sut.assignWorkScheduleUseCase.execute).toHaveBeenCalled();
    expect(sut.listUsersUseCase.execute).toHaveBeenCalled();
    expect(sut.deactivateUserUseCase.execute).toHaveBeenCalled();
    expect(sut.reactivateUserUseCase.execute).toHaveBeenCalled();
    expect(sut.deleteUserUseCase.execute).toHaveBeenCalled();
  });
});
