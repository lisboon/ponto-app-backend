import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard, JwtPayload } from '../auth/auth-guard';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '@/modules/@shared/domain/enums';
import { UserService } from './user.service';
import { RegisterBodyDto } from './dto/register.body.dto';
import { LoginBodyDto } from './dto/login.body.dto';
import { UpdateProfileBodyDto } from './dto/update-profile.body.dto';
import { UpdateSelfProfileBodyDto } from './dto/update-self-profile.body.dto';
import { ChangeRoleBodyDto } from './dto/change-role.body.dto';
import { AssignWorkScheduleBodyDto } from './dto/assign-work-schedule.body.dto';
import { SearchUsersQueryDto } from './dto/search-users.query.dto';

const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } } as const;

@ApiTags('Auth')
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @Throttle(AUTH_THROTTLE)
  @ApiOperation({ summary: 'Login do usuário' })
  login(@Body() body: LoginBodyDto) {
    return this.userService.login(body);
  }
}

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  me(@Request() req: { user: JwtPayload }) {
    return this.userService.findById({ id: req.user.userId });
  }

  @Put('me')
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Atualiza o próprio perfil (campos restritos)' })
  updateMe(
    @Request() req: { user: JwtPayload },
    @Body() body: UpdateSelfProfileBodyDto,
  ) {
    return this.userService.updateProfile({ id: req.user.userId, ...body });
  }

  @Post()
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Cadastra um novo usuário (apenas ADMIN)' })
  register(@Body() body: RegisterBodyDto) {
    return this.userService.register(body);
  }

  @Get()
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Lista usuários (paginado, com filtros)' })
  list(@Query() query: SearchUsersQueryDto) {
    return this.userService.list(query);
  }

  @Get(':id')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Busca um usuário por id' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById({ id });
  }

  @Put(':id')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Atualiza qualquer usuário (ADMIN)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProfileBodyDto,
  ) {
    return this.userService.updateProfile({ id, ...body });
  }

  @Patch(':id/role')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Altera a função (role) de um usuário' })
  changeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ChangeRoleBodyDto,
  ) {
    return this.userService.changeRole({ id, role: body.role });
  }

  @Patch(':id/work-schedule')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Atribui ou remove a jornada de um usuário' })
  assignWorkSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AssignWorkScheduleBodyDto,
  ) {
    return this.userService.assignWorkSchedule({
      id,
      workScheduleId: body.workScheduleId ?? null,
    });
  }

  @Patch(':id/deactivate')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Desativa um usuário (sem soft-delete)' })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deactivate({ id });
  }

  @Patch(':id/reactivate')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Reativa um usuário previamente desativado' })
  reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.reactivate({ id });
  }

  @Delete(':id')
  @Roles({ role: UserRole.ADMIN })
  @HttpCode(200)
  @ApiOperation({ summary: 'Soft-delete de um usuário' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete({ id });
  }
}
