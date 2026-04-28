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
import { HolidayService } from './holiday.service';
import { CreateHolidayBodyDto } from './dto/create.body.dto';
import { UpdateHolidayBodyDto } from './dto/update.body.dto';
import { ListHolidaysQueryDto } from './dto/list-holidays.query.dto';

@ApiTags('Holidays')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('holidays')
@UseGuards(AuthGuard, RolesGuard)
export class HolidayController {
  constructor(private readonly service: HolidayService) {}

  @Post()
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Cria um feriado' })
  create(@Body() body: CreateHolidayBodyDto) {
    return this.service.create(body);
  }

  @Get()
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({
    summary: 'Lista feriados de um ano (inclui recorrentes)',
  })
  list(@Query() query: ListHolidaysQueryDto) {
    return this.service.listByYear({ year: query.year });
  }

  @Get(':id')
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Busca um feriado por id' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById({ id });
  }

  @Put(':id')
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Atualiza um feriado existente' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateHolidayBodyDto,
  ) {
    return this.service.update({ id, ...body });
  }

  @Delete(':id')
  @Roles({ role: UserRole.ADMIN })
  @HttpCode(200)
  @ApiOperation({ summary: 'Soft-delete de um feriado' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete({ id });
  }
}
