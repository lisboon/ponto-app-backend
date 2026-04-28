export interface HourBankDto {
  id: string;
  userId: string;
  balanceMinutes: number;
  lastRecalculatedAt?: Date;
  updatedAt: Date;
}

export interface FindByUserHourBankFacadeInputDto {
  userId: string;
}
export type FindByUserHourBankFacadeOutputDto = HourBankDto | null;

export interface RecalculateHourBankFacadeInputDto {
  userId: string;
}
export type RecalculateHourBankFacadeOutputDto = HourBankDto;

export interface HourBankFacadeInterface {
  findByUser(
    data: FindByUserHourBankFacadeInputDto,
  ): Promise<FindByUserHourBankFacadeOutputDto>;
  recalculate(
    data: RecalculateHourBankFacadeInputDto,
  ): Promise<RecalculateHourBankFacadeOutputDto>;
}
