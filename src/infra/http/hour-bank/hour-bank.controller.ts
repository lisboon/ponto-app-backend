import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth-guard';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '@/modules/@shared/domain/enums';
import { HourBankService } from './hour-bank.service';

@ApiTags('Hour Bank')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('hour-bank')
@UseGuards(AuthGuard, RolesGuard)
export class HourBankController {
  constructor(private readonly service: HourBankService) {}

  @Get(':userId')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Consulta saldo do banco de horas de um usuário' })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.findByUser(userId);
  }

  @Post(':userId/recalculate')
  @HttpCode(200)
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({
    summary: 'Recalcula saldo do banco de horas a partir dos WorkDays fechados',
  })
  recalculate(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.service.recalculate(userId);
  }
}
