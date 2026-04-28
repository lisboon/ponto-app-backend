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
import { AuthGuard, JwtPayload } from '../auth/auth-guard';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../shared/roles.decorator';
import { UserRole } from '@/modules/@shared/domain/enums';
import { AnnouncementService } from './announcement.service';
import { CreateDraftBodyDto } from './dto/create-draft.body.dto';
import { ListAnnouncementsQueryDto } from './dto/list-announcements.query.dto';

@ApiTags('Announcements')
@ApiBearerAuth()
@ApiResponse({ status: 422, description: 'Erro de validação' })
@Controller('announcements')
@UseGuards(AuthGuard, RolesGuard)
export class AnnouncementController {
  constructor(private readonly service: AnnouncementService) {}

  @Post()
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({ summary: 'Cria um rascunho de comunicado' })
  create(
    @Body() body: CreateDraftBodyDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.service.createDraft({
      authorId: req.user.userId,
      title: body.title,
      content: body.content,
    });
  }

  @Post(':id/publish')
  @HttpCode(200)
  @Roles({ role: UserRole.ADMIN })
  @ApiOperation({
    summary: 'Publica um rascunho e envia e-mail para todos os usuários',
  })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.publish(id);
  }

  @Get()
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Lista comunicados' })
  list(@Query() query: ListAnnouncementsQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({ summary: 'Busca comunicado por id' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findById(id);
  }

  @Post(':id/read')
  @HttpCode(200)
  @Roles({ role: UserRole.EMPLOYEE })
  @ApiOperation({
    summary: 'Marca comunicado como lido pelo usuário autenticado',
  })
  markRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.service.markRead({
      announcementId: id,
      userId: req.user.userId,
    });
  }
}
