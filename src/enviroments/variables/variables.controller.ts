import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Req,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VariablesService } from './variables.service';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
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

@ApiTags('Variables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/enviroments/:env_name/variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Listar todas las variables de un entorno paginadas' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'per_page', required: false, type: Number })
  async listAll(
    @Req() req: Request,
    @Query() paginationDto: PaginationDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    const baseUrl = req.url.split('?')[0];
    return await this.variablesService.listAll(paginationDto, baseUrl, envName);
  }

  @Post()
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Crear una nueva variable en un entorno (solo admin)' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  async create(
    @Body() createVariableDto: CreateVariableDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.create(createVariableDto, envName);
  }

  @Get(':var_name')
  @Version('1')
  @ApiOperation({ summary: 'Obtener los detalles de una variable por nombre' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  @ApiParam({ name: 'var_name', description: 'Nombre de la variable', type: String })
  async findOne(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.findOne(varName, envName);
  }

  @Put(':var_name')
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar completamente una variable (solo admin)' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  @ApiParam({ name: 'var_name', description: 'Nombre de la variable', type: String })
  async totalUpdate(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Body() createVariableDto: CreateVariableDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.totalUpdate(varName, createVariableDto, envName);
  }

  @Patch(':var_name')
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar parcialmente una variable (solo admin)' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  @ApiParam({ name: 'var_name', description: 'Nombre de la variable', type: String })
  async partialUpdate(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Body() updateEnviromentDto: UpdateVariableDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.partialUpdate(varName, updateEnviromentDto, envName);
  }

  @Delete(':var_name')
  @Version('1')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar una variable de entorno (solo admin)' })
  @ApiParam({ name: 'env_name', description: 'Nombre del entorno', type: String })
  @ApiParam({ name: 'var_name', description: 'Nombre de la variable', type: String })
  async remove(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.remove(varName, envName);
  }
}
