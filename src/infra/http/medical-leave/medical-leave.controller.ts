import {
  Body,
  Controller,
  Delete,
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
import { AuthGuard, JwtPayload } from '../auth/auth-guard';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '@/modules/@shared/domain/enums';
import { MedicalLeaveService } from './medical-leave.service';
import { CreateMedicalLeaveBodyDto } from './dto/create.body.dto';
import { ListByUserMedicalLeaveQueryDto } from './dto/list-by-user.query.dto';

@ApiTags('Medical Leaves')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('medical-leaves')
@UseGuards(AuthGuard, RolesGuard)
export class MedicalLeaveController {
  constructor(private readonly service: MedicalLeaveService) {}

  @Post()
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({
    summary: 'Cria um atestado e gera os WorkDays MEDICAL_LEAVE no range',
  })
  create(
    @Request() req: { user: JwtPayload },
    @Body() body: CreateMedicalLeaveBodyDto,
  ) {
    return this.service.create({ ...body, createdBy: req.user.userId });
  }

  @Get('users/:userId')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Lista atestados de um usuário' })
  listByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: ListByUserMedicalLeaveQueryDto,
  ) {
    return this.service.listByUser({
      userId,
      activeOnly: query.activeOnly,
    });
  }

  @Get(':id')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Busca um atestado por id' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById({ id });
  }

  @Delete(':id')
  @Roles({ role: UserRole.ADMIN })
  @HttpCode(200)
  @ApiOperation({
    summary: 'Revoga um atestado e reverte os WorkDays do range',
  })
  revoke(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.service.revoke({ id, revokedBy: req.user.userId });
  }
}
