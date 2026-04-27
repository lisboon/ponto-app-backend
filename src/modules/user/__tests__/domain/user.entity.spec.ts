import { User } from '../../domain/user.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { ContractType, UserRole } from '@/modules/@shared/domain/enums';

const validProps = () => ({
  email: 'maria@studio.local',
  name: 'Maria do RH',
  password: '$2b$10$hashedpassword',
});

describe('User', () => {
  describe('create', () => {
    it('cria usuário válido com defaults', () => {
      const user = User.create(validProps());
      expect(user.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(user.email).toBe('maria@studio.local');
      expect(user.name).toBe('Maria do RH');
      expect(user.role).toBe(UserRole.EMPLOYEE);
      expect(user.active).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.deletedAt).toBeUndefined();
    });

    it('cria usuário com campos administrativos', () => {
      const user = User.create({
        ...validProps(),
        role: UserRole.ADMIN,
        position: 'RH',
        contractType: ContractType.CLT,
        weeklyMinutes: 2400,
        hourlyRate: 50,
        hireDate: new Date('2024-01-15'),
      });
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.position).toBe('RH');
      expect(user.contractType).toBe(ContractType.CLT);
      expect(user.weeklyMinutes).toBe(2400);
      expect(user.hourlyRate).toBe(50);
      expect(user.hireDate).toEqual(new Date('2024-01-15'));
    });

    it('rejeita email inválido', () => {
      expect(() =>
        User.create({ ...validProps(), email: 'not-an-email' }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita nome muito curto', () => {
      expect(() => User.create({ ...validProps(), name: 'x' })).toThrow(
        EntityValidationError,
      );
    });

    it('rejeita senha vazia', () => {
      expect(() => User.create({ ...validProps(), password: '' })).toThrow(
        EntityValidationError,
      );
    });

    it('rejeita weeklyMinutes negativo', () => {
      expect(() => User.create({ ...validProps(), weeklyMinutes: -1 })).toThrow(
        EntityValidationError,
      );
    });

    it('rejeita weeklyMinutes acima de 10080', () => {
      expect(() =>
        User.create({ ...validProps(), weeklyMinutes: 10081 }),
      ).toThrow(EntityValidationError);
    });

    it('rejeita hourlyRate negativo', () => {
      expect(() => User.create({ ...validProps(), hourlyRate: -0.01 })).toThrow(
        EntityValidationError,
      );
    });

    it('normaliza email (trim + lowercase)', () => {
      const user = User.create({
        ...validProps(),
        email: '  Maria@Studio.LOCAL ',
      });
      expect(user.email).toBe('maria@studio.local');
    });
  });

  describe('updateProfile', () => {
    it('atualiza nome e refresh updatedAt', async () => {
      const user = User.create(validProps());
      const before = user.updatedAt.getTime();
      await new Promise((r) => setTimeout(r, 2));
      user.updateProfile({ name: 'Maria Silva' });
      expect(user.name).toBe('Maria Silva');
      expect(user.updatedAt.getTime()).toBeGreaterThan(before);
    });

    it('atualiza email', () => {
      const user = User.create(validProps());
      user.updateProfile({ email: 'maria.silva@studio.local' });
      expect(user.email).toBe('maria.silva@studio.local');
    });

    it('normaliza email ao atualizar', () => {
      const user = User.create(validProps());
      user.updateProfile({ email: '  Maria.Silva@Studio.LOCAL ' });
      expect(user.email).toBe('maria.silva@studio.local');
    });

    it('atualiza campos administrativos', () => {
      const user = User.create(validProps());
      user.updateProfile({
        position: 'Coordenador',
        contractType: ContractType.PJ,
        weeklyMinutes: 1800,
        hourlyRate: 75.5,
      });
      expect(user.position).toBe('Coordenador');
      expect(user.contractType).toBe(ContractType.PJ);
      expect(user.weeklyMinutes).toBe(1800);
      expect(user.hourlyRate).toBe(75.5);
    });

    it('rejeita email inválido', () => {
      const user = User.create(validProps());
      expect(() => user.updateProfile({ email: 'bad-email' })).toThrow(
        EntityValidationError,
      );
    });
  });

  describe('changeRole', () => {
    it('altera a role', () => {
      const user = User.create(validProps());
      user.changeRole(UserRole.MANAGER);
      expect(user.role).toBe(UserRole.MANAGER);
    });
  });

  describe('changePassword', () => {
    it('substitui o hash', () => {
      const user = User.create(validProps());
      user.changePassword('$2b$10$newhashedpassword');
      expect(user.password).toBe('$2b$10$newhashedpassword');
    });
  });

  describe('assignWorkSchedule / unassignWorkSchedule', () => {
    it('atribui e remove a jornada', () => {
      const user = User.create(validProps());
      user.assignWorkSchedule('00000000-0000-4000-8000-000000000001');
      expect(user.workScheduleId).toBe('00000000-0000-4000-8000-000000000001');
      user.unassignWorkSchedule();
      expect(user.workScheduleId).toBeUndefined();
    });
  });

  describe('deactivate / activate / delete', () => {
    it('deactivate marca active=false', () => {
      const user = User.create(validProps());
      user.deactivate();
      expect(user.active).toBe(false);
    });

    it('activate retorna active=true', () => {
      const user = User.create(validProps());
      user.deactivate();
      user.activate();
      expect(user.active).toBe(true);
    });

    it('delete (soft) marca deletedAt e desativa', () => {
      const user = User.create(validProps());
      user.delete();
      expect(user.active).toBe(false);
      expect(user.deletedAt).toBeInstanceOf(Date);
    });
  });

  describe('toJSON', () => {
    it('omite a senha', () => {
      const user = User.create(validProps());
      const json = user.toJSON();
      expect(json).not.toHaveProperty('password');
      expect(json).toMatchObject({
        id: user.id,
        email: 'maria@studio.local',
        name: 'Maria do RH',
        role: UserRole.EMPLOYEE,
        active: true,
      });
    });
  });
});
