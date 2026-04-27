import { UserGateway } from '../../gateway/user.gateway';
import { User } from '../../domain/user.entity';
import { PasswordHashService } from '@/modules/@shared/domain/services/password-hash.service';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { UserRole } from '@/modules/@shared/domain/enums';
import {
  RegisterUseCaseInputDto,
  RegisterUseCaseInterface,
  RegisterUseCaseOutputDto,
} from './register.usecase.dto';

export default class RegisterUseCase implements RegisterUseCaseInterface {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async execute(
    data: RegisterUseCaseInputDto,
  ): Promise<RegisterUseCaseOutputDto> {
    const exists = await this.userGateway.existsByEmail(data.email);
    if (exists) {
      throw new EntityValidationError([
        { field: 'email', message: 'Este email já está em uso' },
      ]);
    }

    const hashedPassword = await this.passwordHashService.hash(data.password);

    const user = User.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role ?? UserRole.EMPLOYEE,
      position: data.position,
      contractType: data.contractType,
      weeklyMinutes: data.weeklyMinutes,
      hourlyRate: data.hourlyRate,
      workScheduleId: data.workScheduleId,
      hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
    });

    await this.userGateway.create(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
