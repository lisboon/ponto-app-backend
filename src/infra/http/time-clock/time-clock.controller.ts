import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request as ExpressRequest } from 'express';
import { AuthGuard, JwtPayload } from '../auth/auth-guard';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '@/modules/@shared/domain/enums';
import { IpAllowlistService } from '@/infra/services/ip-allowlist.service';
import { TimeClockService } from './time-clock.service';
import { ManualPunchBodyDto } from './dto/manual-punch.body.dto';
import { ListHistoryQueryDto } from './dto/list-history.query.dto';

const PUNCH_THROTTLE = { default: { limit: 5, ttl: 60_000 } } as const;

@ApiTags('Time Clock')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('time-clock')
@UseGuards(AuthGuard, RolesGuard)
export class TimeClockController {
  private readonly ipAllowlist = new IpAllowlistService();

  constructor(private readonly service: TimeClockService) {}

  @Post('punch')
  @Throttle(PUNCH_THROTTLE)
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Registra uma batida (próprio user)' })
  punch(@Request() req: ExpressRequest & { user: JwtPayload }) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    return this.service.punch({
      userId: req.user.userId,
      ipAddress: ip,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      outsideStudio: this.ipAllowlist.isOutsideStudio(ip),
    });
  }

  @Get('me/today')
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Retorna o WorkDay de hoje (próprio user)' })
  today(@Request() req: { user: JwtPayload }) {
    const today = new Date().toISOString().slice(0, 10);
    return this.service.findDayByDate({
      userId: req.user.userId,
      date: today,
    });
  }

  @Get('me/history')
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Lista o histórico do próprio user (paginado)' })
  meHistory(
    @Request() req: { user: JwtPayload },
    @Query() query: ListHistoryQueryDto,
  ) {
    return this.service.listHistory({ userId: req.user.userId, ...query });
  }

  @Get('users/:userId/history')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Histórico de um user específico (paginado)' })
  history(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: ListHistoryQueryDto,
  ) {
    return this.service.listHistory({ userId, ...query });
  }

  @Get('users/:userId/days/:date')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'WorkDay de um user numa data específica' })
  findDay(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('date') date: string,
  ) {
    return this.service.findDayByDate({ userId, date });
  }

  @Post('users/:userId/punch')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Insere batida manual (admin) para outro user' })
  manualPunch(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: ManualPunchBodyDto,
  ) {
    return this.service.manualPunch({ userId, ...body });
  }

  @Post('users/:userId/days/:date/recalculate')
  @Roles({ role: UserRole.ADMIN })
  @HttpCode(200)
  @ApiOperation({ summary: 'Recalcula totais do dia (após edição)' })
  recalculate(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('date') date: string,
  ) {
    return this.service.recalculateDay({ userId, date });
  }

  @Post('users/:userId/days/:date/close')
  @Roles({ role: UserRole.ADMIN })
  @HttpCode(200)
  @ApiOperation({ summary: 'Encerra o dia e dispara WorkDayClosedEvent' })
  closeDay(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('date') date: string,
  ) {
    return this.service.closeDay({ userId, date });
  }
}
