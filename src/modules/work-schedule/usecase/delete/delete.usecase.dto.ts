import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export interface DeleteWorkScheduleUseCaseInputDto {
  id: string;
}

export interface DeleteWorkScheduleUseCaseOutputDto {
  id: string;
}

export interface DeleteWorkScheduleUseCaseInterface extends BaseUseCase<
  DeleteWorkScheduleUseCaseInputDto,
  DeleteWorkScheduleUseCaseOutputDto
> {
  execute(
    data: DeleteWorkScheduleUseCaseInputDto,
  ): Promise<DeleteWorkScheduleUseCaseOutputDto>;
}
