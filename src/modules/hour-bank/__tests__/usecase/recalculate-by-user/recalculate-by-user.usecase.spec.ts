import RecalculateByUserUseCase from '../../../usecase/recalculate-by-user/recalculate-by-user.usecase';

const userId = '00000000-0000-4000-8000-000000000001';

const makeGateway = (sum: number, existing = null) => ({
  findByUserId: jest.fn().mockResolvedValue(existing),
  upsert: jest.fn().mockResolvedValue(undefined),
  sumClosedDeltaForUser: jest.fn().mockResolvedValue(sum),
});

describe('RecalculateByUserUseCase', () => {
  it('cria HourBank e define balance com soma dos deltas fechados', async () => {
    const gateway = makeGateway(480);
    const uc = new RecalculateByUserUseCase(gateway);
    const out = await uc.execute({ userId });
    expect(out.balanceMinutes).toBe(480);
    expect(out.lastRecalculatedAt).toBeInstanceOf(Date);
    expect(gateway.upsert).toHaveBeenCalledTimes(1);
  });

  it('balance negativo quando horas devedoras', async () => {
    const gateway = makeGateway(-120);
    const uc = new RecalculateByUserUseCase(gateway);
    const out = await uc.execute({ userId });
    expect(out.balanceMinutes).toBe(-120);
  });
});
