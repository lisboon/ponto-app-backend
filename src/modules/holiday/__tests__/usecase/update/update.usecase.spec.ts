import UpdateHolidayUseCase from '../../../usecase/update/update.usecase';
import { Holiday } from '../../../domain/holiday.entity';
import { HolidayType } from '@/modules/@shared/domain/enums';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';

const validHoliday = () =>
  Holiday.create({
    name: 'Independência',
    date: new Date('2026-09-07'),
    type: HolidayType.NATIONAL,
  });

describe('UpdateHolidayUseCase', () => {
  it('atualiza nome e marca como recorrente', async () => {
    const h = validHoliday();
    const gateway = {
      findById: jest.fn().mockResolvedValue(h),
      findByDate: jest.fn(),
      listByYear: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new UpdateHolidayUseCase(gateway);

    const out = await useCase.execute({
      id: h.id,
      name: 'Sete de Setembro',
      isRecurring: true,
    });

    expect(out.name).toBe('Sete de Setembro');
    expect(out.isRecurring).toBe(true);
    expect(gateway.update).toHaveBeenCalledWith(h);
  });

  it('NotFoundError quando feriado não existe', async () => {
    const gateway = {
      findById: jest.fn().mockResolvedValue(null),
      findByDate: jest.fn(),
      listByYear: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    const useCase = new UpdateHolidayUseCase(gateway);
    await expect(
      useCase.execute({ id: '00000000-0000-4000-8000-000000000000' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
