import { UserGateway } from '../../gateway/user.gateway';
import { User } from '../../domain/user.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { UserDto } from '../../facade/user.facade.dto';
import {
  AssignWorkScheduleUseCaseInputDto,
  AssignWorkScheduleUseCaseInterface,
} from './assign-work-schedule.usecase.dto';

export default class AssignWorkScheduleUseCase implements AssignWorkScheduleUseCaseInterface {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(data: AssignWorkScheduleUseCaseInputDto): Promise<UserDto> {
    const user = await this.userGateway.findById(data.id);
    if (!user) {
      throw new NotFoundError(data.id, User);
    }

    if (data.workScheduleId) {
      user.assignWorkSchedule(data.workScheduleId);
    } else {
      user.unassignWorkSchedule();
    }

    await this.userGateway.update(user);

    return user.toJSON();
  }
}
