import CreateHolidayUseCase from '../../../usecase/create/create.usecase';
import { HolidayType } from '@/modules/@shared/domain/enums';

describe('CreateHolidayUseCase', () => {
  it('cria e persiste o feriado', async () => {
    const gateway = {
      findById: jest.fn(),
      findByDate: jest.fn(),
      listByYear: jest.fn(),
      create: jest.fn().mockResolvedValue(undefined),
      update: jest.fn(),
    };
    const useCase = new CreateHolidayUseCase(gateway);

    const out = await useCase.execute({
      name: 'Independência',
      date: '2026-09-07',
      type: HolidayType.NATIONAL,
      isRecurring: true,
    });

    expect(gateway.create).toHaveBeenCalledTimes(1);
    expect(out.name).toBe('Independência');
    expect(out.isRecurring).toBe(true);
    expect(out.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
