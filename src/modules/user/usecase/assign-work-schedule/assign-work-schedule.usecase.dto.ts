import { IsOptional, IsUUID } from 'class-validator';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { UserDto } from '../../facade/user.facade.dto';

export class AssignWorkScheduleUseCaseInputDto {
  id: string;

  @IsUUID('4', { message: 'workScheduleId inválido' })
  @IsOptional()
  workScheduleId?: string | null;
}

export type AssignWorkScheduleUseCaseOutputDto = UserDto;

export interface AssignWorkScheduleUseCaseInterface extends BaseUseCase<
  AssignWorkScheduleUseCaseInputDto,
  AssignWorkScheduleUseCaseOutputDto
> {
  execute(
    data: AssignWorkScheduleUseCaseInputDto,
  ): Promise<AssignWorkScheduleUseCaseOutputDto>;
}
