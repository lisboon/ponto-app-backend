import PunchUseCase from '../../../usecase/punch/punch.usecase';
import { User } from '@/modules/user/domain/user.entity';
import { WorkSchedule } from '@/modules/work-schedule/domain/work-schedule.entity';
import { WeeklySchedule } from '@/modules/work-schedule/domain/types/schedule-data.shape';
import { UserRole, PunchType, DayStatus } from '@/modules/@shared/domain/enums';

const SCHEDULE_ID = '00000000-0000-4000-8000-000000000050';

const user = () =>
  User.create({
    email: 'maria@studio.local',
    name: 'Maria',
    password: 'hashed',
    role: UserRole.EMPLOYEE,
    workScheduleId: SCHEDULE_ID,
  });

const schedule = (): WorkSchedule => {
  const data: WeeklySchedule = {
    sunday: null,
    monday: { start: '09:00', end: '18:00', breakMinutes: 60 },
    tuesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
    wednesday: { start: '09:00', end: '18:00', breakMinutes: 60 },
    thursday: { start: '09:00', end: '18:00', breakMinutes: 60 },
    friday: { start: '09:00', end: '18:00', breakMinutes: 60 },
    saturday: null,
  };
  return WorkSchedule.create({
    id: SCHEDULE_ID,
    name: 'Padrão',
    scheduleData: data,
  });
};

const makeSut = () => {
  const userInstance = user();
  const scheduleInstance = schedule();

  const timeClockGateway = {
    findDay: jest.fn().mockResolvedValue(null),
    findDayById: jest.fn(),
    saveDay: jest.fn().mockResolvedValue(undefined),
    appendPunch: jest.fn().mockResolvedValue(undefined),
    searchHistory: jest.fn(),
  };
  const userGateway = {
    findById: jest.fn().mockResolvedValue(userInstance),
    findByEmail: jest.fn(),
    existsByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    search: jest.fn(),
  };
  const workScheduleGateway = {
    findById: jest.fn().mockResolvedValue(scheduleInstance),
    create: jest.fn(),
    update: jest.fn(),
    search: jest.fn(),
  };
  const holidayGateway = {
    findById: jest.fn(),
    findByDate: jest.fn().mockResolvedValue(null),
    listByYear: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const transactionManager = {
    execute: jest.fn(async (fn: any) => fn(null)),
  };
  const eventDispatcher = {
    dispatch: jest.fn().mockResolvedValue(undefined),
    register: jest.fn(),
    has: jest.fn(),
    clear: jest.fn(),
  };

  const useCase = new PunchUseCase(
    timeClockGateway as any,
    userGateway as any,
    workScheduleGateway as any,
    holidayGateway as any,
    transactionManager as any,
    eventDispatcher as any,
  );

  return {
    useCase,
    timeClockGateway,
    userGateway,
    workScheduleGateway,
    holidayGateway,
    transactionManager,
    eventDispatcher,
    userInstance,
  };
};

describe('PunchUseCase', () => {
  it('primeira batida do dia: cria WorkDay novo + grava CLOCK_IN', async () => {
    const sut = makeSut();
    const out = await sut.useCase.execute({
      userId: sut.userInstance.id,
      ipAddress: '10.0.0.1',
      userAgent: 'jest',
      outsideStudio: false,
    });

    expect(sut.timeClockGateway.findDay).toHaveBeenCalled();
    expect(sut.timeClockGateway.saveDay).toHaveBeenCalled();
    expect(sut.timeClockGateway.appendPunch).toHaveBeenCalled();
    expect(out.registeredPunch.punchType).toBe(PunchType.CLOCK_IN);
    expect(out.workDay.status).toBe(DayStatus.OPEN);
    expect(out.registeredPunch.outsideStudio).toBe(false);
    expect(sut.eventDispatcher.dispatch).toHaveBeenCalled();
  });

  it('user em feriado: cria WorkDay HOLIDAY mas a batida é rejeitada', async () => {
    const sut = makeSut();
    const HolidayMod = await import('@/modules/holiday/domain/holiday.entity');
    const { HolidayType } = await import('@/modules/@shared/domain/enums');
    const holiday = HolidayMod.Holiday.create({
      name: 'Tiradentes',
      date: new Date(),
      type: HolidayType.NATIONAL,
      isRecurring: true,
    });
    sut.holidayGateway.findByDate.mockResolvedValue(holiday);

    await expect(
      sut.useCase.execute({
        userId: sut.userInstance.id,
        outsideStudio: false,
      }),
    ).rejects.toThrow();
  });
});
