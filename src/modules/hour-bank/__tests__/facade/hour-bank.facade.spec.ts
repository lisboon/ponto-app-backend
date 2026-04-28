import HourBankFacade from '../../facade/hour-bank.facade';

const makeSut = () => {
  const findByUserUseCase = { execute: jest.fn() };
  const recalculateUseCase = { execute: jest.fn() };
  const facade = new HourBankFacade(
    findByUserUseCase as any,
    recalculateUseCase as any,
  );
  return { facade, findByUserUseCase, recalculateUseCase };
};

describe('HourBankFacade', () => {
  it('findByUser delega ao usecase', async () => {
    const { facade, findByUserUseCase } = makeSut();
    findByUserUseCase.execute.mockResolvedValue(null);
    await facade.findByUser({ userId: '00000000-0000-4000-8000-000000000001' });
    expect(findByUserUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('recalculate delega ao usecase', async () => {
    const { facade, recalculateUseCase } = makeSut();
    recalculateUseCase.execute.mockResolvedValue({ balanceMinutes: 0 });
    await facade.recalculate({
      userId: '00000000-0000-4000-8000-000000000001',
    });
    expect(recalculateUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
