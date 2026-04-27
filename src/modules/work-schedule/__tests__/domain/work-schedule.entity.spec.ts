import { WorkSchedule } from '../../domain/work-schedule.entity';
import { WeeklySchedule } from '../../domain/types/schedule-data.shape';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const businessWeek = (): WeeklySchedule => ({
  sunday: null,
  monday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  tuesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  wednesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  thursday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  friday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  saturday: null,
});

const validProps = () => ({
  name: 'Jornada Padrão',
  scheduleData: businessWeek(),
});

describe('WorkSchedule', () => {
  describe('create', () => {
    it('cria jornada válida', () => {
      const ws = WorkSchedule.create(validProps());
      expect(ws.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(ws.name).toBe('Jornada Padrão');
      expect(ws.active).toBe(true);
      expect(ws.deletedAt).toBeUndefined();
    });

    it('rejeita nome curto', () => {
      expect(() => WorkSchedule.create({ ...validProps(), name: 'x' })).toThrow(
        EntityValidationError,
      );
    });

    it('rejeita end <= start', () => {
      const bad = businessWeek();
      bad.monday = { start: '18:00', end: '09:00', breakMinutes: 0 };
      expect(() =>
        WorkSchedule.create({ ...validProps(), scheduleData: bad }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita formato de hora inválido', () => {
      const bad = businessWeek();
      bad.monday = { start: '9:00', end: '18:00', breakMinutes: 60 };
      expect(() =>
        WorkSchedule.create({ ...validProps(), scheduleData: bad }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita breakMinutes negativo', () => {
      const bad = businessWeek();
      bad.monday = { start: '09:00', end: '18:00', breakMinutes: -1 };
      expect(() =>
        WorkSchedule.create({ ...validProps(), scheduleData: bad }),
      ).toThrow(EntityValidationError);
    });

    it('aceita null em todos os dias (folga total)', () => {
      const empty: WeeklySchedule = {
        sunday: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
      };
      const ws = WorkSchedule.create({
        name: 'Folga total',
        scheduleData: empty,
      });
      expect(ws.expectedMinutesForWeekday('monday')).toBe(0);
    });
  });

  describe('expectedMinutesForWeekday', () => {
    it('calcula minutos esperados descontando o break', () => {
      const ws = WorkSchedule.create(validProps());
      // 09:00 → 18:00 = 9h = 540min, menos 60min break = 480min
      expect(ws.expectedMinutesForWeekday('monday')).toBe(480);
    });

    it('retorna 0 em dia de folga', () => {
      const ws = WorkSchedule.create(validProps());
      expect(ws.expectedMinutesForWeekday('saturday')).toBe(0);
      expect(ws.expectedMinutesForWeekday('sunday')).toBe(0);
    });

    it('nunca retorna negativo', () => {
      const data = businessWeek();
      data.monday = { start: '09:00', end: '10:00', breakMinutes: 120 };
      const ws = WorkSchedule.create({ name: 'Curta', scheduleData: data });
      expect(ws.expectedMinutesForWeekday('monday')).toBe(0);
    });
  });

  describe('expectedMinutesForDate', () => {
    it('mapeia data para weekday correto', () => {
      const ws = WorkSchedule.create(validProps());
      // 2026-04-27 é segunda-feira
      const monday = new Date('2026-04-27T12:00:00');
      expect(ws.expectedMinutesForDate(monday)).toBe(480);
    });
  });

  describe('updateSchedule', () => {
    it('atualiza nome', () => {
      const ws = WorkSchedule.create(validProps());
      ws.updateSchedule({ name: 'Nova Jornada' });
      expect(ws.name).toBe('Nova Jornada');
    });

    it('rejeita scheduleData inválido', () => {
      const ws = WorkSchedule.create(validProps());
      const bad = businessWeek();
      bad.monday = { start: '18:00', end: '09:00', breakMinutes: 0 };
      expect(() => ws.updateSchedule({ scheduleData: bad })).toThrow(
        EntityValidationError,
      );
    });
  });

  describe('delete', () => {
    it('soft-delete marca deletedAt e desativa', () => {
      const ws = WorkSchedule.create(validProps());
      ws.delete();
      expect(ws.active).toBe(false);
      expect(ws.deletedAt).toBeInstanceOf(Date);
    });
  });
});
