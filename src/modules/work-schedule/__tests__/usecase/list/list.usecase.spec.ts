import ListWorkSchedulesUseCase from '../../../usecase/list/list.usecase';
import { WorkSchedule } from '../../../domain/work-schedule.entity';
import { WeeklySchedule } from '../../../domain/types/schedule-data.shape';
import { SearchResult } from '@/modules/@shared/repository/search-result';

const week = (): WeeklySchedule => ({
  sunday: null,
  monday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  tuesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  wednesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  thursday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  friday: { start: '09:00', end: '18:00', breakMinutes: 60 },
  saturday: null,
});

describe('ListWorkSchedulesUseCase', () => {
  it('encaminha filtros para o gateway e retorna paginação', async () => {
    const items = [
      WorkSchedule.create({ name: 'Padrão', scheduleData: week() }),
      WorkSchedule.create({ name: 'Reduzida', scheduleData: week() }),
    ];
    const gateway = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      search: jest.fn().mockResolvedValue(
        new SearchResult({
          items,
          total: 2,
          currentPage: 1,
          perPage: 20,
        }),
      ),
    };
    const useCase = new ListWorkSchedulesUseCase(gateway);

    const out = await useCase.execute({
      name: 'Padrão',
      active: true,
      page: 1,
      perPage: 20,
    });

    expect(gateway.search).toHaveBeenCalledWith({
      filter: { name: 'Padrão', active: true },
      sort: undefined,
      sortDir: undefined,
      page: 1,
      perPage: 20,
    });
    expect(out.items).toHaveLength(2);
    expect(out.total).toBe(2);
    expect(out.lastPage).toBe(1);
  });
});
