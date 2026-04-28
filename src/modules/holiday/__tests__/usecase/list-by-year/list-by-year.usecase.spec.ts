import ListByYearHolidayUseCase from '../../../usecase/list-by-year/list-by-year.usecase';
import { Holiday } from '../../../domain/holiday.entity';
import { HolidayType } from '@/modules/@shared/domain/enums';

describe('ListByYearHolidayUseCase', () => {
  it('encaminha o ano para o gateway e mapeia toJSON', async () => {
    const items = [
      Holiday.create({
        name: 'Ano Novo',
        date: new Date('2026-01-01'),
        type: HolidayType.NATIONAL,
        isRecurring: true,
      }),
    ];
    const gateway = {
      findById: jest.fn(),
      findByDate: jest.fn(),
      listByYear: jest.fn().mockResolvedValue(items),
      create: jest.fn(),
      update: jest.fn(),
    };
    const useCase = new ListByYearHolidayUseCase(gateway);

    const out = await useCase.execute({ year: 2026 });

    expect(gateway.listByYear).toHaveBeenCalledWith(2026);
    expect(out.year).toBe(2026);
    expect(out.items).toHaveLength(1);
    expect(out.items[0].name).toBe('Ano Novo');
  });
});
