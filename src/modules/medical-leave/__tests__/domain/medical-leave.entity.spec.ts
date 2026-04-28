import { MedicalLeave } from '../../domain/medical-leave.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const USER_ID = '00000000-0000-4000-8000-000000000001';
const ADMIN_ID = '00000000-0000-4000-8000-000000000002';
const REVOKER_ID = '00000000-0000-4000-8000-000000000003';

const validProps = () => ({
  userId: USER_ID,
  createdBy: ADMIN_ID,
  startDate: new Date(2026, 4, 5),
  endDate: new Date(2026, 4, 7),
  attachmentUrl: 'https://files.studio.local/atestado.pdf',
});

describe('MedicalLeave', () => {
  describe('create', () => {
    it('cria atestado válido com 3 dias', () => {
      const ml = MedicalLeave.create(validProps());
      expect(ml.affectedDays()).toHaveLength(3);
      expect(ml.isRevoked).toBe(false);
    });

    it('rejeita end < start', () => {
      expect(() =>
        MedicalLeave.create({
          ...validProps(),
          startDate: new Date(2026, 4, 7),
          endDate: new Date(2026, 4, 5),
        }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita attachmentUrl vazio', () => {
      expect(() =>
        MedicalLeave.create({ ...validProps(), attachmentUrl: '' }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita userId inválido', () => {
      expect(() =>
        MedicalLeave.create({ ...validProps(), userId: 'not-uuid' }),
      ).toThrow(EntityValidationError);
    });
  });

  describe('emitCreatedEvent', () => {
    it('produz MedicalLeaveCreatedEvent com daysAffected', () => {
      const ml = MedicalLeave.create(validProps());
      ml.emitCreatedEvent();
      const events = ml.pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('MedicalLeaveCreatedEvent');
    });
  });

  describe('revoke', () => {
    it('revoga e emite MedicalLeaveRevokedEvent', () => {
      const ml = MedicalLeave.create(validProps());
      ml.revoke(REVOKER_ID);
      expect(ml.isRevoked).toBe(true);
      expect(ml.revokedBy).toBe(REVOKER_ID);
      expect(ml.revokedAt).toBeInstanceOf(Date);
      const events = ml.pullEvents();
      expect(
        events.some((e) => e.eventName === 'MedicalLeaveRevokedEvent'),
      ).toBe(true);
    });

    it('rejeita re-revogação', () => {
      const ml = MedicalLeave.create(validProps());
      ml.revoke(REVOKER_ID);
      expect(() => ml.revoke(REVOKER_ID)).toThrow(EntityValidationError);
    });
  });
});
