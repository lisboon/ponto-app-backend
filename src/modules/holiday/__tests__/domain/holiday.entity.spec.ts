import { Holiday } from '../../domain/holiday.entity';
import { HolidayType } from '@/modules/@shared/domain/enums';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const validProps = () => ({
  name: 'Independência',
  date: new Date('2026-09-07'),
  type: HolidayType.NATIONAL,
});

describe('Holiday', () => {
  describe('create', () => {
    it('cria feriado válido (não recorrente por default)', () => {
      const h = Holiday.create(validProps());
      expect(h.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(h.name).toBe('Independência');
      expect(h.type).toBe(HolidayType.NATIONAL);
      expect(h.isRecurring).toBe(false);
      expect(h.active).toBe(true);
      expect(h.deletedAt).toBeUndefined();
    });

    it('aceita feriado recorrente com descrição', () => {
      const h = Holiday.create({
        ...validProps(),
        isRecurring: true,
        description: 'Independência do Brasil',
      });
      expect(h.isRecurring).toBe(true);
      expect(h.description).toBe('Independência do Brasil');
    });

    it('rejeita nome curto', () => {
      expect(() => Holiday.create({ ...validProps(), name: 'x' })).toThrow(
        EntityValidationError,
      );
    });

    it('rejeita data inválida', () => {
      expect(() =>
        Holiday.create({ ...validProps(), date: new Date('not-a-date') }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita descrição muito longa', () => {
      expect(() =>
        Holiday.create({ ...validProps(), description: 'x'.repeat(501) }),
      ).toThrow(EntityValidationError);
    });
  });

  describe('updateHoliday', () => {
    it('atualiza campos e refresh updatedAt', async () => {
      const h = Holiday.create(validProps());
      const before = h.updatedAt.getTime();
      await new Promise((r) => setTimeout(r, 2));
      h.updateHoliday({ name: 'Sete de Setembro', isRecurring: true });
      expect(h.name).toBe('Sete de Setembro');
      expect(h.isRecurring).toBe(true);
      expect(h.updatedAt.getTime()).toBeGreaterThan(before);
    });

    it('rejeita nome curto', () => {
      const h = Holiday.create(validProps());
      expect(() => h.updateHoliday({ name: 'x' })).toThrow(
        EntityValidationError,
      );
    });
  });

  describe('delete', () => {
    it('soft-delete marca deletedAt', () => {
      const h = Holiday.create(validProps());
      h.delete();
      expect(h.active).toBe(false);
      expect(h.deletedAt).toBeInstanceOf(Date);
    });
  });
});
