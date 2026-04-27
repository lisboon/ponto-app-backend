import { UserGateway } from '../../gateway/user.gateway';
import { User } from '../../domain/user.entity';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { PasswordHashService } from '@/modules/@shared/domain/services/password-hash.service';
import { UserDto } from '../../facade/user.facade.dto';
import {
  UpdateProfileUseCaseInputDto,
  UpdateProfileUseCaseInterface,
} from './update-profile.usecase.dto';

export default class UpdateProfileUseCase implements UpdateProfileUseCaseInterface {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(data: UpdateProfileUseCaseInputDto): Promise<UserDto> {
    const user = await this.userGateway.findById(data.id);
    if (!user) {
      throw new NotFoundError(data.id, User);
    }

    if (data.email && data.email !== user.email) {
      const exists = await this.userGateway.existsByEmail(data.email);
      if (exists) {
        throw new EntityValidationError([
          { field: 'email', message: 'Este email já está em uso' },
        ]);
      }
    }

    user.updateProfile({
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl,
      position: data.position,
      contractType: data.contractType,
      weeklyMinutes: data.weeklyMinutes,
      hourlyRate: data.hourlyRate,
      hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
    });

    if (data.password) {
      const hashed = await this.passwordHashService.hash(data.password);
      user.changePassword(hashed);
    }

    await this.userGateway.update(user);

    return user.toJSON();
  }
}
