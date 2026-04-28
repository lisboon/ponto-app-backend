import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
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
import { JustificationService } from './justification.service';
import { CreateJustificationBodyDto } from './dto/create.body.dto';
import { UpdateJustificationBodyDto } from './dto/update.body.dto';
import { ApproveJustificationBodyDto } from './dto/approve.body.dto';
import { RejectJustificationBodyDto } from './dto/reject.body.dto';
import { ListJustificationsQueryDto } from './dto/list-justifications.query.dto';

@ApiTags('Justifications')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('justifications')
@UseGuards(AuthGuard, RolesGuard)
export class JustificationController {
  constructor(private readonly service: JustificationService) {}

  @Post()
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Abre uma justificação para um WorkDay' })
  create(
    @Request() req: { user: JwtPayload },
    @Body() body: CreateJustificationBodyDto,
  ) {
    return this.service.create({
      ...body,
      createdBy: req.user.userId,
    });
  }

  @Get()
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Lista justificações (paginado, filtros)' })
  list(@Query() query: ListJustificationsQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Busca uma justificação por id' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById({ id });
  }

  @Put(':id')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Edita conteúdo (apenas em PENDING)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateJustificationBodyDto,
  ) {
    return this.service.update({ id, ...body });
  }

  @Patch(':id/approve')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Aprova a justificação' })
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
    @Body() body: ApproveJustificationBodyDto,
  ) {
    return this.service.approve({
      id,
      reviewerId: req.user.userId,
      reviewNote: body.reviewNote,
    });
  }

  @Patch(':id/reject')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Rejeita a justificação (nota obrigatória)' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
    @Body() body: RejectJustificationBodyDto,
  ) {
    return this.service.reject({
      id,
      reviewerId: req.user.userId,
      reviewNote: body.reviewNote,
    });
  }
}
