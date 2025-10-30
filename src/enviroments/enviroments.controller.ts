import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Version,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnviromentsService } from './enviroments.service';
import { CreateEnviromentDto } from './dto/create-enviroment.dto';
import { UpdateEnviromentDto } from './dto/update-enviroment.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SlugValidationPipe } from 'src/common/pipes/SlugValidationPipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Enviroments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enviroments')
export class EnviromentsController {
  constructor(private readonly enviromentsService: EnviromentsService) {}

  @Get(':env_name.json')
  @Version('1')
  @ApiOperation({ summary: 'Obtener todas las variables de un entorno en formato JSON plano' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  async getMassConsumption(@Param('env_name', new SlugValidationPipe) envName: string) {
    return await this.enviromentsService.handleMassConsumption(envName);
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Listar todos los entornos paginados' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async listAll(@Req() req: Request, @Query() paginationDto: PaginationDto) {
    const baseUrl = req.url.split('?')[0];
    return await this.enviromentsService.listAll(paginationDto, baseUrl);
  }

  @Post()
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo entorno (solo admin)' })
  async create(@Body() createEnviromentDto: CreateEnviromentDto) {
    return await this.enviromentsService.create(createEnviromentDto);
  }

  @Get(':env_name')
  @Version('1')
  @ApiOperation({ summary: 'Obtener los detalles de un entorno por nombre' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  async findOne(@Param('env_name', new SlugValidationPipe) envName: string) {
    return await this.enviromentsService.findOne(envName);
  }

  @Put(':env_name')
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar completamente un entorno (solo admin)' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  async totalUpdate(
    @Param('env_name', new SlugValidationPipe) envName: string,
    @Body() createEnviromentDto: CreateEnviromentDto,
  ) {
    return await this.enviromentsService.totalUpdate(envName, createEnviromentDto);
  }

  @Patch(':env_name')
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar parcialmente un entorno (solo admin)' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  async partialUpdate(
    @Param('env_name', new SlugValidationPipe) envName: string,
    @Body() updateEnviromentDto: UpdateEnviromentDto,
  ) {
    return await this.enviromentsService.partialUpdate(envName, updateEnviromentDto);
  }

  @Delete(':env_name')
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un entorno y sus variables (solo admin)' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  async remove(@Param('env_name', new SlugValidationPipe) envName: string) {
    return await this.enviromentsService.remove(envName);
  }
}
