import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export interface DeleteHolidayUseCaseInputDto {
  id: string;
}

export interface DeleteHolidayUseCaseOutputDto {
  id: string;
}

export interface DeleteHolidayUseCaseInterface extends BaseUseCase<
  DeleteHolidayUseCaseInputDto,
  DeleteHolidayUseCaseOutputDto
> {
  execute(
    data: DeleteHolidayUseCaseInputDto,
  ): Promise<DeleteHolidayUseCaseOutputDto>;
}
