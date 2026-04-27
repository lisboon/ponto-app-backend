import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export interface DeleteUserUseCaseInputDto {
  id: string;
}

export interface DeleteUserUseCaseOutputDto {
  id: string;
}

export interface DeleteUserUseCaseInterface extends BaseUseCase<
  DeleteUserUseCaseInputDto,
  DeleteUserUseCaseOutputDto
> {
  execute(data: DeleteUserUseCaseInputDto): Promise<DeleteUserUseCaseOutputDto>;
}
