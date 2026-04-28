import { Justification } from '../../domain/justification.entity';
import { JustificationStatus } from '@/modules/@shared/domain/enums';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const USER_ID = '00000000-0000-4000-8000-000000000001';
const WORK_DAY_ID = '00000000-0000-4000-8000-000000000002';
const ADMIN_ID = '00000000-0000-4000-8000-000000000003';
const REVIEWER_ID = '00000000-0000-4000-8000-000000000004';

const validProps = () => ({
  userId: USER_ID,
  workDayId: WORK_DAY_ID,
  createdBy: ADMIN_ID,
  description: 'Atrasou por questão pessoal',
});

describe('Justification', () => {
  describe('create', () => {
    it('cria justificação válida em PENDING', () => {
      const j = Justification.create(validProps());
      expect(j.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(j.status).toBe(JustificationStatus.PENDING);
      expect(j.reviewedBy).toBeUndefined();
    });

    it('rejeita descrição curta', () => {
      expect(() =>
        Justification.create({ ...validProps(), description: 'x' }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita userId inválido', () => {
      expect(() =>
        Justification.create({ ...validProps(), userId: 'not-uuid' }),
      ).toThrow(EntityValidationError);
    });
  });

  describe('approve', () => {
    it('aprova PENDING e emite JustificationApprovedEvent', () => {
      const j = Justification.create(validProps());
      j.approve(REVIEWER_ID, 'Confirmado pelo gestor');
      expect(j.status).toBe(JustificationStatus.APPROVED);
      expect(j.reviewedBy).toBe(REVIEWER_ID);
      expect(j.reviewedAt).toBeInstanceOf(Date);
      expect(j.reviewNote).toBe('Confirmado pelo gestor');
      const events = j.pullEvents();
      expect(
        events.some((e) => e.eventName === 'JustificationApprovedEvent'),
      ).toBe(true);
    });

    it('rejeita re-aprovação', () => {
      const j = Justification.create(validProps());
      j.approve(REVIEWER_ID);
      expect(() => j.approve(REVIEWER_ID)).toThrow(EntityValidationError);
    });
  });

  describe('reject', () => {
    it('rejeita PENDING com nota e emite JustificationRejectedEvent', () => {
      const j = Justification.create(validProps());
      j.reject(REVIEWER_ID, 'Falta sem comprovação');
      expect(j.status).toBe(JustificationStatus.REJECTED);
      expect(j.reviewNote).toBe('Falta sem comprovação');
      const events = j.pullEvents();
      expect(
        events.some((e) => e.eventName === 'JustificationRejectedEvent'),
      ).toBe(true);
    });

    it('exige nota obrigatória', () => {
      const j = Justification.create(validProps());
      expect(() => j.reject(REVIEWER_ID, '')).toThrow(EntityValidationError);
    });

    it('rejeita re-revisão após APPROVED', () => {
      const j = Justification.create(validProps());
      j.approve(REVIEWER_ID);
      expect(() => j.reject(REVIEWER_ID, 'reverter')).toThrow(
        EntityValidationError,
      );
    });
  });

  describe('updateContent', () => {
    it('atualiza descrição em PENDING', () => {
      const j = Justification.create(validProps());
      j.updateContent({ description: 'Nova descrição mais detalhada' });
      expect(j.description).toBe('Nova descrição mais detalhada');
    });

    it('rejeita edição após review', () => {
      const j = Justification.create(validProps());
      j.approve(REVIEWER_ID);
      expect(() =>
        j.updateContent({ description: 'tentando editar depois' }),
      ).toThrow(EntityValidationError);
    });
  });
});
