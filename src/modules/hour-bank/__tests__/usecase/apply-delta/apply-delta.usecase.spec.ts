import ApplyDeltaUseCase from '../../../usecase/apply-delta/apply-delta.usecase';
import { HourBank } from '../../../domain/hour-bank.entity';

const userId = '00000000-0000-4000-8000-000000000001';

const makeGateway = (existing: HourBank | null = null) => ({
  findByUserId: jest.fn().mockResolvedValue(existing),
  upsert: jest.fn().mockResolvedValue(undefined),
  sumClosedDeltaForUser: jest.fn().mockResolvedValue(0),
});

describe('ApplyDeltaUseCase', () => {
  it('cria HourBank novo e aplica delta positivo', async () => {
    const gateway = makeGateway(null);
    const uc = new ApplyDeltaUseCase(gateway);
    const out = await uc.execute({ userId, delta: 90 });
    expect(out.balanceMinutes).toBe(90);
    expect(gateway.upsert).toHaveBeenCalledTimes(1);
  });

  it('acumula delta em HourBank existente', async () => {
    const existing = HourBank.create(userId);
    existing.applyDelta(60);
    const gateway = makeGateway(existing);
    const uc = new ApplyDeltaUseCase(gateway);
    const out = await uc.execute({ userId, delta: -30 });
    expect(out.balanceMinutes).toBe(30);
  });

  it('aceita delta negativo (horas devedoras)', async () => {
    const gateway = makeGateway(null);
    const uc = new ApplyDeltaUseCase(gateway);
    const out = await uc.execute({ userId, delta: -45 });
    expect(out.balanceMinutes).toBe(-45);
  });
});
