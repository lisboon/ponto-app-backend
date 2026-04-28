import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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
import { WorkScheduleService } from './work-schedule.service';
import { CreateWorkScheduleBodyDto } from './dto/create.body.dto';
import { UpdateWorkScheduleBodyDto } from './dto/update.body.dto';
import { SearchWorkSchedulesQueryDto } from './dto/search-work-schedules.query.dto';

@ApiTags('Work Schedules')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('work-schedules')
@UseGuards(AuthGuard, RolesGuard)
export class WorkScheduleController {
  constructor(private readonly service: WorkScheduleService) {}

  @Post()
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Cria uma nova jornada (rotina semanal)' })
  create(@Body() body: CreateWorkScheduleBodyDto) {
    return this.service.create(body);
  }

  @Get()
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Lista jornadas (paginado, com filtros)' })
  list(@Query() query: SearchWorkSchedulesQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  @Roles({ role: UserRole.MANAGER })
  @ApiOperation({ summary: 'Busca uma jornada por id' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById({ id });
  }

  @Put(':id')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Atualiza uma jornada existente' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateWorkScheduleBodyDto,
  ) {
    return this.service.update({ id, ...body });
  }

  @Delete(':id')
  @Roles({ role: UserRole.ADMIN })
  @HttpCode(200)
  @ApiOperation({ summary: 'Soft-delete de uma jornada' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete({ id });
  }
}
