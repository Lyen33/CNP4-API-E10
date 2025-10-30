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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/enviroments/:env_name/variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) {}

  // ✅ Requiere autenticación, cualquier rol
  @Get()
  @Version('1')
  async listAll(
    @Req() req: Request,
    @Query() paginationDto: PaginationDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    const baseUrl = req.url.split('?')[0];
    return await this.variablesService.listAll(paginationDto, baseUrl, envName);
  }

  // 🔒 Solo rol 'admin' puede crear
  @Post()
  @Version('1')
  @Roles('admin')
  async create(
    @Body() createVariableDto: CreateVariableDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.create(createVariableDto, envName);
  }

  // ✅ Requiere autenticación, cualquier rol
  @Get(':var_name')
  @Version('1')
  async findOne(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.findOne(varName, envName);
  }

  // 🔒 Solo rol 'admin' puede hacer total update
  @Put(':var_name')
  @Version('1')
  @Roles('admin')
  async totalUpdate(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Body() createVariableDto: CreateVariableDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.totalUpdate(varName, createVariableDto, envName);
  }

  // 🔒 Solo rol 'admin' puede hacer partial update
  @Patch(':var_name')
  @Version('1')
  @Roles('admin')
  async partialUpdate(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Body() updateEnviromentDto: UpdateVariableDto,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.partialUpdate(varName, updateEnviromentDto, envName);
  }

  // 🔒 Solo rol 'admin' puede eliminar
  @Delete(':var_name')
  @Version('1')
  @Roles('admin')
  async remove(
    @Param('var_name', new SlugValidationPipe) varName: string,
    @Param('env_name', new SlugValidationPipe) envName: string,
  ) {
    return await this.variablesService.remove(varName, envName);
  }
}
