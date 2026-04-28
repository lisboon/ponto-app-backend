import { HourBank } from '../../domain/hour-bank.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const validUserId = '00000000-0000-4000-8000-000000000001';

describe('HourBank entity', () => {
  it('cria com balance zero por padrão', () => {
    const hb = HourBank.create(validUserId);
    expect(hb.balanceMinutes).toBe(0);
    expect(hb.userId).toBe(validUserId);
  });

  it('applyDelta acumula corretamente', () => {
    const hb = HourBank.create(validUserId);
    hb.applyDelta(60);
    hb.applyDelta(-30);
    expect(hb.balanceMinutes).toBe(30);
  });

  it('setBalance sobrescreve e registra lastRecalculatedAt', () => {
    const hb = HourBank.create(validUserId);
    hb.applyDelta(120);
    hb.setBalance(45);
    expect(hb.balanceMinutes).toBe(45);
    expect(hb.lastRecalculatedAt).toBeInstanceOf(Date);
  });

  it('lança EntityValidationError com userId inválido', () => {
    expect(() => new HourBank({ userId: 'nao-uuid' })).toThrow(
      EntityValidationError,
    );
  });
});
